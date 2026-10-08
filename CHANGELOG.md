# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Added

- Contain Ring (`ring.com`).
- Contain CamelCamelCamel (`camelcamelcamel.com`, `camelcamelcamel.ca`, `camelcamelcamel.co.uk`, `camelcamelcamel.de`, `camelcamelcamel.es`, `camelcamelcamel.it`).
- Contain Kadgar (`kadgar.net`), a Twitch multistream site.
- Support additional Audible marketplaces: Brazil (`audible.com.br`), India (`audible.co.in`), and Spain (`audible.es`).
- Block Twitch CDN subresources (`ttvnw.net`, `jtvnw.net`, `twitchcdn.net`, `twitchsvc.net`) from non-Twitch origins.
- Strip the `fbclid` tracking parameter from navigation requests.

### Changed

- Amazon host matching is now case-insensitive and escapes regex metacharacters, avoiding false positives.
- Cookie and Service Worker cleanup runs once per domain instead of once per container.

### Fixed

- Remove cookies using each cookie's own domain and path, so cookies set on subdomains such as `www.amazon.com` are actually wiped.
- Cancel requests for tabs that no longer exist instead of reopening them in a new container tab.
- Ignore malformed URLs instead of throwing during containment checks.

### Removed

- Dead browser action/panel code, `tabStates` tracking, and the unused `stripAzclid` helper.

## [2.0.0] - 2019-11-26

### Changed

- Rebuilt in line with Mozilla's Facebook Container, relying on Firefox 67+ container support.

## [1.0.1] - 2018-12-27

### Changed

- Organized the domain lists and updated packaging metadata.

## [1.0.0] - 2018-12-27

### Added

- Initial release: isolates Amazon into a container and prevents Amazon from tracking browsing outside of it.

[Unreleased]: https://github.com/otacoo/contain-amazon/compare/v2.0.0...HEAD
[2.0.0]: https://github.com/otacoo/contain-amazon/compare/v1.0.1...v2.0.0
[1.0.1]: https://github.com/otacoo/contain-amazon/compare/v1.0.0...v1.0.1
[1.0.0]: https://github.com/otacoo/contain-amazon/releases/tag/v1.0.0
