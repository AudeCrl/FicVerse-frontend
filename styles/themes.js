// themes.js
export const themes = {
  watercolor: {
    light: {
      background: '#FFFFFF',
      text: '#000000',
      secondaryText: '#717171',
      primary: '#DEDAFF',
      primaryPlus: '#B0A7FF',
      inactive: '#E6E6E6',
      inactivePlus: '#CCCCCC',
      selectedText: '#8071F4',
      tagPalette: ['#E2F5D6', '#C6DCFF', '#FEF7E7', '#CBEEED', '#F2D9E9'],
      segmentation: '#C4C4C4',
      inputBorder: '#E0E0E0',
      authBackground: require('../assets/watercolorLightProfileBG.jpg'),
      headerBackground: require('../assets/watercolorLightHeaderBG.jpg'),
      footerBackground: require('../assets/watercolorLightFooterBG.jpg'),
    },
    dark: {
      background: '#09141E',
      text: '#E0E0E0',
      secondaryText: '#808080',
      primary: '#492673',
      primaryPlus: '#7A3FC0',
      selectedText: '#A067E4',
      inactive: '#333333',
      inactivePlus: '#616161',
      tagPalette: ['#2D4C19', '#142C52', '#585504', '#194D4B', '#4C1A3A'],
      segmentation: '#474747',
      inputBorder: '#434343',
      authBackground: require('../assets/watercolorDarkProfileBG.jpg'),
      headerBackground: require('../assets/watercolorDarkHeaderBG.jpg'),
      footerBackground: require('../assets/watercolorDarkFooterBG.jpg'),
    }
  },
  ashgreen: {
    light: {
      background: '#F9FBFA',
      text: '#171C1A',
      secondaryText: '#717171',
      primary: '#97bba8',
      primaryPlus: '#84b39a',
      inactive: '#E6E6E6',
      inactivePlus: '#CCCCCC',
      selectedText: '#84b39a',
      tagPalette: ['#dbebec', '#b8cdcd', '#98b3a9', '#88a2a8', '#7f9c8f'],
      segmentation: '#C4C4C4',
      inputBorder: '#E0E0E0',
      authBackground: require('../assets/ashgreenLightProfileBG.png'),
      headerBackground: require('../assets/ashgreenLightHeaderBG.png'),
      footerBackground: require('../assets/ashgreenLightFooterBG.png'),
    },
    dark: {
      background: '#171c1a',
      text: '#c1d8ca',
      secondaryText: '#afc4b8',
      primary: '#43756b',
      primaryPlus: '#4d8378',
      selectedText: '#66b28a',
      inactive: '#333333',
      inactivePlus: '#616161',
      tagPalette: ['#6f7e73', '#57675c', '#3f4e43', '#274237', '#3e5c51'],
      segmentation: '#474747',
      inputBorder: '#434343',
      authBackground: require('../assets/ashgreenDarkProfileBG.jpg'),
      headerBackground: require('../assets/ashgreenDarkHeaderBG.jpg'),
      footerBackground: require('../assets/ashgreenDarkFooterBG.jpg'),
    }
  },

  // forest: {
  //   light: {
  //     background: '#f4f9f4',
  //     text: '#1b4332',
  //     primary: '#40916c',
  //     secondary: '#95d5b2',
  //     accent: '#74c69d',
  //     tagPalette: ['#d8f3dc', '#b7e4c7', '#95d5b2', '#74c69d', '#52b788']
  //   },
  //   dark: {
  //     background: '#081c15',
  //     text: '#d8f3dc',
  //     primary: '#52b788',
  //     secondary: '#74c69d',
  //     accent: '#95d5b2',
  //     tagPalette: ['#2d6a4f', '#40916c', '#74c69d', '#b7e4c7', '#d8f3dc']
  //   }
  // }
};