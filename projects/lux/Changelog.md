# Lux Changelog

## Version 0.16.4

2021.10.28

- Bug fix: Fix clean value in autocomplete. [#161](https://github.com/metadevpro/lux/issues/161).
- Bug fix: Rounded corners in textarea. [#159](https://github.com/metadevpro/lux/issues/159).

## Version 0.16.0

2021.10.15

- Bug fix: Improvements to validation in lux-geolocation and lux-map. [#152](https://github.com/metadevpro/lux/issues/152).

## Version 0.15.3

2021.10.15

- Bug fix: autocomplete selection when filtering. [#154](https://github.com/metadevpro/lux/issues/154).

## Version 0.15.0

2021.10.13

- Bug fix: unset width for modal map.

## Version 0.14.0

2021.10.07

- Feature: New control `lux-datetime`. Support for UTC/local time, and with or without seconds precission.

## Version 0.13.0

2021.10.04

- Fix lux.autocomplete to trigger changed value on lostfocus (not 200ms later) [#150](https://github.com/metadevpro/lux/issues/150).

## Version 0.12.0

2021.09.15

- Fix lux.input to mark as touched on blur [#138](https://github.com/metadevpro/lux/issues/138).

## Version 0.11.0

2021.09.13

- Export customizable settings as CSS variables.

## Version 0.10.1

2021.09.09

- Fix pattern. undefined check [#133](https://github.com/metadevpro/lux/issues/133).

## Version 0.10.0

2021.09.09

- Added autocomplete.keepOpenAfterDelete [#124](https://github.com/metadevpro/lux/issues/124).
- Added to autocomplete suggestions indicator [#127](https://github.com/metadevpro/lux/issues/127).
- Added spinner to autocomplete [#128](https://github.com/metadevpro/lux/issues/128).
- Added input pattern [#119](https://github.com/metadevpro/lux/issues/119).
- Fix checkbox [#125](https://github.com/metadevpro/lux/issues/125).

## Version 0.9.0

2021.08.09

- Added new `Autocomplete.canAddNewValue`. When activated canAddNewValue this flag allows to pick any value. (The datasource is a set of suggestions but not enforced). [#117](https://github.com/metadevpro/lux/issues/117).

## Version 0.8.0

2021.07.27

- Added new `Map` and `Geolocation` components based in OpenLayers.

## Version 0.7.10

2021.07.05

- Fix: Validation for `number`: Do not allow 'e' as a valid number.

## Version 0.7.9

2021.06.29

- Fix: Do not open drowdown on autocomplete when disabled.
- Fix: Do valueChange at the end if there are meaningful changes (#109)

## Version 0.7.8

2021.06.29

- Fix: Pagination Next. Proect from invalid values.

## Version 0.7.7

2021.06.29

- Fix: empty incomplete dates should succeed.
- Fix: max value validation.

## Version 0.7.6

2021.06.28

- Do not trigger autocomplete on emptry value and Tab.

## Version 0.7.5

2021.06.28

- Fix expand on autocomplete (z-index)
- Refactor validation logic on input

## Version 0.7.4

2021.06.27

- Trigger touch on autocomplete and autocmplete-list, input.
- Convert undefined in input into null

## Version 0.7.2

2021.06.27

- Ignore accents on search: autocomplete
- Limit max & min dates to year 2100 and 1900 by default.

## Version 0.7.1

2021.06.26

- Fix disabled on input

## Version 0.7.0

2021.06.26

- Support Spanish language for checkbox, autocomplete, autocomplete-list, pagination.
- Fix and refactor of the pagination component.
- Fix on the checkbox component.

## Version 0.6.0

2021.06.23

- Port to Angular version 12.
- Upgraded to latest eslint and libs.

## Version 0.5.6

2021.06.23

- Implemented ValueControlAccessor in all input compontes to support ngModel and ngForms.
- Last version built with Angular 11.

## Version 0.5.5

2021.06.21

- Fix lux-input date when ISO timestamp arrives for dates.

## Version 0.5.4

2021.06.21

- Fix missing initial value binding for lux-input (3)

## Version 0.5.3

2021.06.18

- Fix missing initial value binding for lux-input (2) (Not use.)

## Version 0.5.2

2021.06.18

- Fix missing initial value binding for lux-input (Not use.)

## Version 0.5.0

2021.06.18

- Implement ControlValueAccessor in lux-input.
- Conform to ngForms validation
- Fix pagination bug [#89](https://github.com/metadevpro/lux/pull/89).
- Fix validation on input geoposition [#86](https://github.com/metadevpro/lux/issues/86).

## Version 0.4.4

2021.06.08

- Relax typing in lux-input.value. Can double- databind to `any` type.

## Version 0.4.3

2021.06.07

- Fix width for input and autocomplete
- Refactor modal
- Added Accesibility improvements

## Version 0.4.2

2021.06.03

- Fix: Keyboard entry for lux-input dates.

## Version 0.4.1

2021.06.01

- Fix: Autcomplete. set size.

## Version 0.4.0

- Fix: Pagination. Reimplemented for page to be be 0-index instead of 1-index.

## Version 0.3.2

- Add missing dependency to `angular-resize-event`.

## Version 0.3.0

2021.05.26

- Fix [#61](https://github.com/metadevpro/lux/issues/61) Fix autocomplete width on resize
- Fix [#63](https://github.com/metadevpro/lux/issues/63) Autocomplete shouldn't allow text to be under the close button

## Version 0.2.0

2021.05.21

- Refactor to use css-grid layout and Rem units. [#59](https://github.com/metadevpro/lux/issues/59)
- This is the last version using Angular 11. Next one to upgrade to v. 12.

## Version 0.1.0

2021.05.13

- Improved Autocomplete
- Added AutocmpleteList
- Implement input.geolocation [#41](https://github.com/metadevpro/lux/issues/41)
- Fix to value bind in input type=numeric when using the stepper control Fix [#55](https://github.com/metadevpro/lux/issues/55)
- Versions 0.1.0 supports Angular 11.

## Version 0.0.16

2021.04.15

- Added VoiceRecognition support on Chrome.
- Added changelog
- Added VoiceRecognition Support
- Upgraded dependent libs
