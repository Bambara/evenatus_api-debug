# Evenatus E Sport Platform Backend API

<div>
  <h1 align="center">Getting Started with Node JS 🚀 </h1>
  <p>
    This is the documentation of Flutter Applications.
    It contains all the information you need to get started with
    and make changes to your App
  </p>
</div>

### Table of Contents

- [System Requirements](#system-requirements)
- [Figma design guidelines for better accuracy](#figma-design-guideline-for-better-accuracy)
- [App Navigations](#app-navigations)
- [Project Structure](#project-structure)
- [How you can do code formatting?](#how-you-can-do-code-formatting)
- [How you can improve the readability of code?](#how-you-can-improve-the-readability-of-code)
- [Libraries and tools used](#libraries-and-tools-used)
- [Support](#support)

## System Requirements

Dart SDK Version 2.18.0 or greater.
Flutter SDK Version 3.3.0 or greater.

### Figma design guidelines for better accuracy

Read our guidelines to increase the accuracy of design conversion to code by optimizing Figma designs.
https://docs.dhiwise.com/docs/Designguidelines/intro

### App Navigations

Check your app's UI from the AppNavigation screen of your app.

### Project Structure

After successful build, your application structure should look like this:

```
.
├── evenatus-api                    - main project directory.
    ├── controllers                 - contains all controller classes
    ├── models                      - contains all model files (database schema)
    │   ├── app_export.dart         - contains commonly used file imports 
    │   ├── constants               - contains all constants classes
    │   ├── errors                  - contains error handling classes                  
    │   ├── network                 - contains network related classes
    │   └── utils                   - contains common files and utilities of project
    ├── routes
    │   ├── apiClient               - contains API calling methods 
    │   ├── models                  - contains request/response models 
    │   └── repository              - network repository
    ├── utils                       - contains localization classes
    ├── .env                        - contains all screens and screen controllers
    ├── .gitignore                  - contains all the routes of application
    ├── db.js                       - contains app theme and decoration classes
    ├── package.json                - contains all custom widget classes
    ├── package-lock.json           - contains all custom widget classes
    ├── Procfile                    - contains all custom widget classes
    ├── README.md                   - contains all custom widget classes
    └── server.js                   - contains all custom widget classes
```

### How you can do code formatting?

- if your code is not formatted then run following command in your terminal to format code
  ```
  dart format .
  ```

### How you can improve the readability of code?

Resolve the errors and warnings that are shown in the application.

### Libraries and tools used

- get - State management
  https://pub.dev/packages/get
- connectivity_plus - For status of network connectivity
  https://pub.dev/packages/connectivity_plus
- shared_preferences - Provide persistent storage for simple data
  https://pub.dev/packages/shared_preferences
- cached_network_image - For storing internet image into cache
  https://pub.dev/packages/cached_network_image

### Support

If you have problems or questions go to our Discord channel, we will then try to help you as quickly as possible: https://discord.com/invite/rFMnCG5MZ7

### Image Assets

We were unable to find Images, Please add manually to ```project/assets``` and replace image_not_found Image constant with original file

| File Name             | Not Found Assets Count |
|-----------------------|:----------------------:|
| albums_screen         |           1            |
| home_page_screen      |           1            |
| song_menu_full_screen |           6            |
| playlist_screen       |           6            |
| top_playlists_screen  |           1            |
| favorites_screen      |           1            |
| profile_screen        |           1            |
| artists_screen        |           1            |
| album_screen          |           1            |

