# Directus Extension - Disable Listing

Disable listing of collections for public users. Listings for users with app access to the data studio and admins are
always allowed.

[![NPM version][npm-version-image]][npm-url] [![License][license-image]][license-url]
[![NPM downloads][npm-downloads-image]][npm-url]

## Installation

```
npm install directus-extension-disable-listing
```

## Options

### Customize which routes to bypass the disabling

Add the `EXT_DISABLE_LISTING_BYPASS_ROUTES` environment variable with the route name separated by commas. For
collections within the `items` route, prefix with `items/`.

Defaults to `auth` as it's required for the Data Studio to function.

Example: `auth,items/articles,items/comments`

### Customize which HTTP method to bypass the disabling

Add the `EXT_DISABLE_LISTING_BYPASS_METHODS` environment variable with the HTTP method separated by commas.

Defaults to no method being bypassed.

Example: `get,post`

### Customize whether authenticated users bypass the disabling

Add the `EXT_DISABLE_LISTING_ALLOW_AUTHENTICATED` environment variable with a boolean value.

Defaults to `false`.

Example: `true`

## License

GPLv3 License. See the [LICENSE](LICENSE) file.

[npm-downloads-image]: https://img.shields.io/npm/dm/directus-extension-disable-listing.svg?style=flat-square
[npm-version-image]: https://img.shields.io/npm/v/directus-extension-disable-listing.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/directus-extension-disable-listing
[license-url]: https://github.com/licitdev/directus-extension-disable-listing/blob/main/LICENSE
[license-image]: https://img.shields.io/npm/l/directus-extension-disable-listing.svg?style=flat-square
