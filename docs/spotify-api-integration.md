# Spotify integration for Music Hub

Spotify Home is a placeholder in `SpotifyHomePage`. The fit for this Vite app plus Hono API is the Web API, with the Web Playback SDK only for in-browser playback. Run Authorization Code on the API. Client credentials cannot read a user's playlists or player.

| Limit | Value |
| --- | --- |
| Users in development mode | 5 |
| Access token lifetime | 1 hour |
| Recent tracks per request | 50 |
| Search results per page | 10 |

Since 27 Nov 2024, apps still in development mode, and any app registered on or after that date, cannot use Recommendations, Related Artists, Audio Features, Audio Analysis, featured playlists, category playlists, or algorithmic and editorial playlists. The reference pages for those endpoints are still published. A new Music Hub client should expect them to fail.

## Spotify Home panels

Source: Spotify Web API reference, Web Playback SDK, 27 Nov 2024 Web API changes, and the February 2026 development-mode migration guide.

| Panel | Fit | Call | Constraint |
| --- | --- | --- | --- |
| Now playing | Redesign | Web Playback SDK `player_state_changed`, plus `PUT /me/player` to transfer | Premium only. Metadata and progress, not a waveform. Playback starts only after a user gesture. |
| Minutes listened | Redesign | `GET /me/player/recently-played` | Sum `track.duration_ms` for at most 50 recent plays. There is no lifetime minutes endpoint. |
| Top genre | Usable | `GET /me/top/artists`, then `GET /artists/{id}` | `Artist.genres` is still returned. `followers` and `popularity` are removed in development mode. |
| Playlist count | Usable | `GET /me/playlists` | Use the paging `total`. Private lists need `playlist-read-private`; collaborative lists need `playlist-read-collaborative`. |
| Playlists categorizer | Redesign | `GET /me/playlists`, then `GET /playlists/{id}/items` | Items are returned only for playlists the user owns or collaborates on. Group by artist genre. Mood, tempo, and key are unavailable. |
| Music modifiers | Blocked | `GET /audio-features/{id}` and `GET /audio-analysis/{id}` | Closed to new apps since 27 Nov 2024. Energy, danceability, and key cannot be read. Do not process the Spotify stream. |
| Playlist suggestions | Redesign | `GET /search`, then `POST /me/playlists` and `POST /playlists/{id}/items` | `GET /recommendations`, related artists, and editorial playlists are closed to new apps. Search pages are capped at 10. |

## API calls

Authorized? means a new development-mode app may call it. Useful for panels names the Spotify Home blocks in this app. Authorized calls are listed first. Source: Spotify Web API reference, scopes, Web Playback SDK, the 27 Nov 2024 change post, and the February 2026 development-mode migration guide.

| API call | Authorized? | Useful for panels | Constraints |
| --- | --- | --- | --- |
| `GET https://accounts.spotify.com/authorize` | Yes | All panels | Authorization Code. `response_type=code`, exact `redirect_uri`, and a `state` value. Scopes are fixed at this step. A later refresh does not add scopes. |
| `POST https://accounts.spotify.com/api/token` | Yes | All panels | Exchange the code with the client secret on the API. Access tokens last 1 hour. `invalid_grant` means the refresh token is expired or revoked and the user must authorize again. |
| `GET /me` | Yes | All panels | Link the session with `account_id`. In development mode, `country`, `email`, `explicit_content`, `followers`, and `product` are removed, so subscription level does not come from this profile. |
| `GET /me/player` | Yes | Now playing | Requires `user-read-playback-state`. Returns device, item, `progress_ms`, and `is_playing` for the user's current playback. |
| `GET /me/player/currently-playing` | Yes | Now playing | Requires `user-read-currently-playing`. Narrower than `GET /me/player`: the current item, without the full device list. |
| `PUT /me/player` | Yes | Now playing | Transfer playback. Requires `user-modify-playback-state` and Premium. `device_ids` accepts one device id. `play:true` starts playback on that device. |
| `PUT /me/player/play` | Yes | Now playing | Start or resume on a Premium account. Pass `device_id`, plus `context_uri` or `uris`. The Web Playback SDK does not start audio until the user interacts with it. |
| Web Playback SDK (`sdk.scdn.co/spotify-player.js`) | Yes | Now playing | Requires `streaming`, `user-read-email`, and `user-read-private`, plus full Premium. `player_state_changed` returns position, duration, and track metadata. No PCM tap. `account_error` when the account is not eligible. Commercial use needs Spotify's prior written approval. Do not sync the recording to generated visuals. |
| `GET /me/player/recently-played` | Yes | Minutes listened | Requires `user-read-recently-played`. `limit` maximum is 50. Sum `track.duration_ms` and label the window with `played_at`. This is not lifetime listening time. Podcast episodes are not included. |
| `GET /me/top/artists` | Yes | Top genre, Playlist suggestions | Requires `user-top-read`. `time_range` is `short_term` (about 4 weeks), `medium_term` (about 6 months, the default), or `long_term` (about 1 year). `limit` maximum is 50. `genres` remains. `followers` and `popularity` are removed in development mode. |
| `GET /me/top/tracks` | Yes | Playlist suggestions | Same scope and `time_range` values as top artists. Track `popularity` is removed in development mode, so do not rank suggestions by it. |
| `GET /artists/{id}` | Yes | Top genre, Playlists categorizer | Returns `genres`. Development mode allows one artist id per request. Cache the result. `followers` and `popularity` are removed. |
| `GET /me/playlists` | Yes | Playlist count, Playlists categorizer | Paging `total` is the playlist count. `playlist-read-private` adds private playlists. `playlist-read-collaborative` adds collaborative ones. The `tracks` summary field is renamed to `items`. |
| `GET /playlists/{id}/items` | Yes | Playlists categorizer | Replacement for `GET /playlists/{id}/tracks`. Items are returned only when the user owns the playlist or collaborates on it. Simplified artists omit genres. Use `fields=` and `snapshot_id` to avoid refetching an unchanged playlist. |
| `POST /me/playlists` | Yes | Playlist suggestions | Creates an empty playlist. `name` is required. `public` defaults to `true`. A private playlist needs `playlist-modify-private`. Each user is generally limited to 11,000 playlists. Replaces `POST /users/{user_id}/playlists`. |
| `POST /playlists/{id}/items` | Yes | Playlist suggestions | Adds track or episode URIs. Maximum 100 items per request. Send URIs in the JSON body. Requires `playlist-modify-private` or `playlist-modify-public`. |
| `GET /search` | Yes | Music modifiers, Playlist suggestions | Field filters include `genre`, `year`, `artist`, `album`, `track`, `tag:new`, and `tag:hipster`. In development mode, `limit` maximum is 10 and the default is 5. Page with `offset`. This is the catalog filter that remains after audio features were closed. |
| `GET /artists?ids=` | No | Playlists categorizer | Batch artist fetch was removed for development-mode apps in February 2026. Replace with `GET /artists/{id}`. |
| `GET /artists/{id}/top-tracks` | No | Playlist suggestions | Removed for development-mode apps in February 2026. No replacement endpoint. |
| `GET /artists/{id}/related-artists` | No | Playlist suggestions | Closed to new and development-mode apps on 27 Nov 2024. |
| `GET /playlists/{id}/tracks` | No | Playlists categorizer | Renamed to `GET /playlists/{id}/items` for development-mode apps in February 2026. Response field `tracks` moved to `items`. |
| `POST /users/{user_id}/playlists` | No | Playlist suggestions | Removed for development-mode apps in February 2026. Use `POST /me/playlists`. |
| `GET /audio-features/{id}` | No | Music modifiers | Closed to new and development-mode apps on 27 Nov 2024. Energy, danceability, and key are not available. |
| `GET /audio-analysis/{id}` | No | Music modifiers, Now playing | Closed to new and development-mode apps on 27 Nov 2024. Bars, beats, tempo, and key cannot drive modifiers or a synced visualizer. |
| `GET /recommendations` | No | Playlist suggestions | Closed to new and development-mode apps on 27 Nov 2024. Build suggestions from top artists plus `GET /search`. |
| `GET /browse/featured-playlists` | No | Playlist suggestions | Get Featured Playlists was closed to new and development-mode apps on 27 Nov 2024, including algorithmic and editorial playlists. |
| `GET /browse/categories/{id}/playlists` | No | Playlist suggestions | Get Category's Playlists was closed on 27 Nov 2024. `GET /browse/categories` was removed for development mode in February 2026. |

## Authorization on the existing API

Spotify's authorization guide recommends the Authorization Code flow when a long-running server can store the client secret and refresh tokens. This repo already has that server. PKCE is the alternative when the secret cannot leave the browser. Implicit grant is deprecated. Client credentials authorize the app, not the user, so they cannot fill this page.

The browser still needs a short-lived access token. The Web Playback SDK calls `getOAuthToken` on connect and again when the token expires, which Spotify documents as a maximum of 60 minutes. Keep the refresh token on the API. If refresh returns `invalid_grant`, drop the token and send the user through authorize again.

### Token boundary

Put `SPOTIFY_CLIENT_ID` and `SPOTIFY_CLIENT_SECRET` in `api/.env`. Never prefix the secret with `VITE_`. The client id may be public. The redirect URI registered in the dashboard must match character for character, including `localhost` versus `127.0.0.1`. The app is served at `http://localhost:5173`, and `App.tsx` has no router, so read the returned code on load or add a callback route before exchanging it.

Exchange the code with `POST https://accounts.spotify.com/api/token` using `grant_type=authorization_code` and an HTTP Basic header of the client id and secret. Store the refresh token in a new table. The `users` table is documented as a public profile and has no place for tokens. Link the row with `account_id` from `GET /me`. Spotify says that field is the stable account identifier, and that `id` must not be used for linking.

Development mode requires the app owner to keep Spotify Premium, or the app stops until they resubscribe. At most five users can be allowlisted. Anyone else can log in and then receive 403 on API calls. Extended quota mode, as of 15 May 2025, accepts organizations only and asks for at least 250,000 monthly active users. This project stays in development mode.

## Scopes to request together

Changing scopes later requires a new authorization. A refresh does not add scopes. Source: Spotify scopes reference and the Web Playback SDK web-app player guide.

| Scope | Used for |
| --- | --- |
| `streaming`, `user-read-email`, `user-read-private` | Web Playback SDK. `email` and `product` on `GET /me` are deprecated for development-mode apps, so do not read subscription level from the profile. |
| `user-read-playback-state`, `user-read-currently-playing` | `GET /me/player` and the currently playing track for the now-playing panel. |
| `user-modify-playback-state` | Transfer playback with `PUT /me/player` and start it with `PUT /me/player/play`. Both require Premium. |
| `user-read-recently-played` | Recent plays for the minutes estimate. |
| `user-top-read` | Top artists and tracks over short, medium, or long term. |
| `playlist-read-private`, `playlist-read-collaborative` | Owned, followed, and collaborative playlists. |
| `playlist-modify-private` | Create a private suggestion playlist and add up to 100 URIs per `POST /playlists/{id}/items`. |

## How to fill each panel

### Now playing

Load `https://sdk.scdn.co/spotify-player.js` and construct `Spotify.Player` after `onSpotifyWebPlaybackSDKReady`. On ready, transfer playback to that `device_id`. `player_state_changed` supplies position, duration, and `track_window.current_track`, including name, artists, and album images. The SDK does not document a PCM or Web Audio tap. Show title, art, and progress. Spotify's developer policy forbids synchronizing a sound recording with visual media such as video or a slideshow, and it forbids altering Spotify audio. Leave the separate Audio Visualizer feature on local audio. If the account is not full Premium, the SDK emits `account_error`. Mobile-only Premium plans are excluded. Playback does not start by itself.

### Listen stats

Playlist count is the `total` on `GET /me/playlists`. Top genre comes from `GET /me/top/artists`. `time_range` is `short_term` (about 4 weeks), `medium_term` (about 6 months, the default), or `long_term` (about 1 year). Count genres on those artist objects. If a genre list is empty, fetch `GET /artists/{id}` for that artist. Minutes listened is the sum of `duration_ms` on `GET /me/player/recently-played`, whose `limit` maximum is 50, using `played_at` only as a label for that window.

### Playlist tools

List playlists, then load items only when the user opens one. February 2026 renamed `GET /playlists/{id}/tracks` to `GET /playlists/{id}/items`, and renamed the `tracks` field to `items`. Followed playlists that the user does not own or collaborate on omit items. Simplified artists on those items do not include genres, and `GET /artists?ids=` was removed, so cache one `GET /artists/{id}` per artist in Postgres. Use `snapshot_id` to skip a playlist that has not changed. Rate limits are a rolling 30-second window. A 429 includes `Retry-After` in seconds. Development mode can also return 429 with reason `QUOTA_EXCEEDED`.

Replace the modifiers copy. Search is the catalog filter that remains: `GET /search` supports `genre`, `year`, `album`, `artist`, `track`, `tag:new`, and `tag:hipster`. In development mode, `limit` max is 10 and the default is 5, so page with `offset`. For suggestions, search tracks in the user's top genres, create an empty playlist with `POST /me/playlists`, then add URIs. A user is generally limited to 11,000 playlists.

## Build order in this repo

| Step | Where | Why this order |
| --- | --- | --- |
| Dashboard app, secret, callback, refresh | `api/.env.example`, `api/src/index.ts`, `App.tsx` | Every other call needs a user token. Vite already proxies `/api` to port 4000. |
| Listen stats | `SpotifyHomePage.tsx` via `/api/spotify` | Three reads, no Premium playback and no removed endpoints. |
| Playlist browser and genre groups | New spotify route plus a genre cache table | Per-artist requests will hit the 30-second rate limit if the page loads every playlist at once. |
| Suggestions saved as a private playlist | `POST /me/playlists` from the API | Depends on top genres and `playlist-modify-private`. |
| In-browser player | SDK script in the now-playing panel | Needs Premium, a user gesture, and a token the browser can hand to `getOAuthToken`. Commercial use of the SDK needs Spotify's prior written approval. |

Evidence: [authorization](https://developer.spotify.com/documentation/web-api/concepts/authorization), [PKCE](https://developer.spotify.com/documentation/web-api/tutorials/code-pkce-flow), [refreshing tokens](https://developer.spotify.com/documentation/web-api/tutorials/refreshing-tokens), [scopes](https://developer.spotify.com/documentation/web-api/concepts/scopes), [quota modes](https://developer.spotify.com/documentation/web-api/concepts/quota-modes), [rate limits](https://developer.spotify.com/documentation/web-api/concepts/rate-limits), [Web Playback SDK](https://developer.spotify.com/documentation/web-playback-sdk), [developer policy](https://developer.spotify.com/policy), the [27 Nov 2024 API change post](https://developer.spotify.com/blog/2024-11-27-changes-to-the-web-api), and the [February 2026 development-mode migration guide](https://developer.spotify.com/documentation/web-api/tutorials/february-2026-migration-guide).
