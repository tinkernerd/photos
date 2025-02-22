# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/); and adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html), but is testing the [Epoch Semantic Versioning](https://antfu.me/posts/epoch-semver).

---

## [Version 1.1.0] - 2025-02-22
### Added
- Region(state) to the db for the cities. 
- Currently adding the state to diffrent areas. 

### Working On
- Creating the ability to export /photograph/id pages as image. Looking at possibly file name of Original Filename-framed.ext

## [Version 1.0.0] - 2025-02-22

### Added
- **`Differences.md`**: Documented the differences between this repository and the original [ECarry/photography-website](https://github.com/ECarry/photography-website) repo. This primarily covers content variations to streamline future updates by allowing easy cloning, modification, and re-commit.
- **`Setup.md`**: Added a detailed walkthrough for setting up the project, providing step-by-step guidance to help users get started.

### Changed
- **Avatar Link**: Moved to `src/constants.ts` and set as `DEFAULT_AVATAR` for better maintainability.
- **AboutCard Text**: Updated the text content to enhance messaging and clarity.
- **External Links**:
  - Updated `xiaohongshu` link to [Website - Tinkernerd](https://tinkernerd.dev).
  - Changed background image source from `/bg.webp` to `https://photograph.tinkernerd.dev/photos/Pickerel_Lake_241108_0062_edit.jpg` in `src/app/(auth)/layout.tsx` & in `src/app/(home)/about/page.tsx`. -> Will Possibly replace background with the slider from homepage.

### Removed
- **Old Photos/Screenshots**: Deleted outdated images and replaced them with the latest versions from the [ECarry/photography-website](https://github.com/ECarry/photography-website) repo for a more consistent and modern look.

## [Pre-Clone] [ECarry/photography-website](https://github.com/ECarry/photography-website) Repo Changes
- 2025-02-13: tRPC instead of Hono.js
- 2025-01-12: Better Auth instead of Next Auth