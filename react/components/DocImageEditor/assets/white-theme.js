import iconA from './svg/icon-a.svg';
import iconB from './svg/icon-b.svg';
import iconC from './svg/icon-c.svg';
import iconD from './svg/icon-d.svg';
import bg from './svg/bg.png';

const whiteTheme = {
  'common.bi.image': 'https://uicdn.toast.com/toastui/img/tui-image-editor-bi.png',
  'common.bisize.width': '251px',
  'common.bisize.height': '21px',
  'common.backgroundImage': bg,
  'common.backgroundColor': '#fff',
  'common.border': '1px solid #c1c1c1',

  // header
  'header.backgroundImage': 'none',
  'header.backgroundColor': 'transparent',
  'header.border': '0px',

  // load button
  'loadButton.backgroundColor': '#fff',
  'loadButton.border': '1px solid #ddd',
  'loadButton.color': '#222',
  'loadButton.fontFamily': '\'Noto Sans\', sans-serif',
  'loadButton.fontSize': '12px',

  // download button
  'downloadButton.backgroundColor': '#fdba3b',
  'downloadButton.border': '1px solid #fdba3b',
  'downloadButton.color': '#fff',
  'downloadButton.fontFamily': '\'Noto Sans\', sans-serif',
  'downloadButton.fontSize': '12px',

  // main icons
  'menu.normalIcon.path': iconD,
  'menu.normalIcon.name': 'icon-d',
  'menu.activeIcon.path': iconB,
  'menu.activeIcon.name': 'icon-b',
  'menu.disabledIcon.path': iconA,
  'menu.disabledIcon.name': 'icon-a',
  'menu.hoverIcon.path': iconC,
  'menu.hoverIcon.name': 'icon-c',
  'menu.iconSize.width': '24px',
  'menu.iconSize.height': '24px',

  // submenu primary color
  'submenu.backgroundColor': 'transparent',
  'submenu.partition.color': '#e5e5e5',

  // submenu icons
  'submenu.normalIcon.path': iconD,
  'submenu.normalIcon.name': 'icon-d',
  'submenu.activeIcon.path': iconB,
  'submenu.activeIcon.name': 'icon-b',
  'submenu.iconSize.width': '32px',
  'submenu.iconSize.height': '32px',

  // submenu labels
  'submenu.normalLabel.color': '#858585',
  'submenu.normalLabel.fontWeight': 'normal',
  'submenu.activeLabel.color': 'var(--text-color)',
  'submenu.activeLabel.fontWeight': 'normal',

  // checkbox style
  'checkbox.border': '1px solid #ccc',
  'checkbox.backgroundColor': '#fff',

  // rango style
  'range.pointer.color': '#333',
  'range.bar.color': '#ccc',
  'range.subbar.color': '#606060',

  'range.disabledPointer.color': 'var(--divider)',
  'range.disabledBar.color': 'rgba(85,85,85,0.06)',
  'range.disabledSubbar.color': 'rgba(51,51,51,0.2)',

  'range.value.color': 'var(--text-color)',
  'range.value.fontWeight': 'normal',
  'range.value.fontSize': '11px',
  'range.value.border': '0',
  'range.value.backgroundColor': '#f5f5f5',
  'range.title.color': 'var(--text-color)',
  'range.title.fontWeight': 'lighter',

  // colorpicker style
  'colorpicker.button.border': '0px',
  'colorpicker.title.color': 'var(--text-color)',
};

export default whiteTheme;
