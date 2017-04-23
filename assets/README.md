
# Oracle APEX dynamic Action Plugin - AtomCalculator
AtomCalculator is a dynamic action plugin that allows users to perform calculations in realtime during data entry by providing a popup calculator for the Input and get the final result.



## Donation

Your support means a lot.

[![Donate](https://img.shields.io/badge/Donate-PayPal-green.svg)](https://www.paypal.me/MYasirAliShah/4)

## Changelog

#### 1.0 - Initial Release


## Install
- Import plugin file "dynamic_action_plugin_com_planetapex_atom_calculator.sql" from source directory into your application
- (Optional) Deploy the CSS/JS files from "src" directory on your webserver and change the "File Prefix" to webservers folder.

## Preview
![Oracle Apex Plugin Atom Calculator](assets/atomCalculator.gif "Atom Calculator")

## Demo Application
[Atom Calculator Application](https://apex.oracle.com/pls/apex/f?p=83009:30 "Atom Calculator Homepage")


## Plugin Features
- 2 Views to choose from.
- Custom Calculator Font Awesome Icon.
- Text Alignment
- Various <b>On Show events</b> like click, focus
- 10 Display Positions to choose from.
- 3 Themes to choose from.
- 3 Button Styles.
- Custom offset to adjust the display position.
- Button Press Animation.
- Keyboard Numeric Keypad for calculation.
- Running Total Cacluations.
- Read Only option.


## Plugin Settings

### Atom Calculator Views
---

Users have 2 options for the atom calculator view:
- Basic view displays calculator without the percentage, PlusMinus and Keys.
- Extended view will display all the keys. 

### Styling

Themes and Button Styles can be use to to style the Atom calculator.

There are 3 themes provided:

- Light
- Dark
- Matetial

There are 3 Button Styles:

- No Style, which is Flat
- Style 1
- Style 2




### Show Method

Selects the method when the atom calculator displays.

Available options include:


<dt>On item click</dt>
<dd>The atom calculator pop-up displays when the item is clicked.</dd>
<dt>On icon click</dt> 
<dd>The atom calculator pop-up displays when the icon is clicked.</dd>
<dt>On item and icon click</dt>
<dd>The atom calculator displays when the item or icon is clicked.</dd>
<dt>On focus</dt>
<dd>The atom calculator pop-up displays as soon as the item receives focus.</dd>





### Display Position

Position of atom calculator is relative to text input.

- First value is name of main axis, and
- Second value is whether the atom calculator is rendered as
  - Left(Leftwards)
  - Right(Rightwards)
  - Up(Upwards)
  - Bottom(Downwards)

Available options include:

- Bottom Left
- Bottom Center
- Bottom Right
- Right Bottom
- Right Top
- Top Left
- Top Center
- Top Right
- Left Top
- Left Bottom

Examples

Right Top will set atom calculator's position from right side upwards of text input.

