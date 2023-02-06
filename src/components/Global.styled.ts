import { palette } from 'theme/palette';
import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  body {
    margin: 0;
    color: white;
    position: relative;
    min-height: 100vh;
    overflow-x: hidden;
    background: #1d2343;
    font-family: 'Libre Franklin', sans-serif;
  }

  * {
    box-sizing: border-box;
  }

  h1, h2, h3, h4, h5, h6, label {
    font-family: 'Inter', sans-serif;
  }

  a {
    text-decoration: none;
    color: rgba(255, 255, 255, 0.52);
    transition: color 350ms;

    &:hover {
      color: rgba(255, 255, 255, 0.88);
    }
  }

  ul {
    margin: 0;
    padding: 0;
    list-style-type: none;
  }

  .MuiModal-root {
    overflow-y: auto;
  }

  .MuiDivider-root {
    border-color: rgba(255, 255, 255, 0.18);
  }

  button {
    &:hover {
      outline: none;
    }
    &:disabled {
      cursor: not-allowed !important;
      pointer-events: auto !important;
    }
  }

  .MuiCard-root {
    border: 0;
  }

  .MuiFormControlLabel-label {
    font-size: 16px;
  }

  .MuiBackdrop-root {
    background: rgba(33, 33, 33, 0.4);
  }

  .MuiBackdrop-invisible {
    background: transparent !important;
    backdrop-filter: none !important;
  }

  .MuiMenu-root {
    .MuiBackdrop-root {
      background: transparent !important;
      backdrop-filter: none !important;
    }
  }

  .MuiAutocomplete-popper {
    .MuiAutocomplete-listbox {
      padding: 0;

      &::-webkit-scrollbar {
        width: 8px;
      }
    
      &::-webkit-scrollbar-thumb {
        background: ${palette.alphaLight[200]};
        border-radius: 8px;
    
        &:hover {
          background:  ${palette.alphaLight[400]};
        }
      }
    }
  }


  .MuiMenu-root, .MuiAutocomplete-popper {
    .MuiPaper-root  {
      background: ${palette.alphaDark[50]};
      backdrop-filter: blur(80px);
      border: 1px solid rgba(255, 255, 255, 0.18);
      box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.16), 0px 16px 24px -2px rgba(0, 0, 0, 0.32);
      border-radius: 6px;
      margin-top: 8px;
      overflow-x: hidden !important;
      font-size: 16px;

      .MuiList-root {
        padding: 0;
      }

      .MuiMenuItem-root {
        background: transparent;
        font-size: 16px;

        &:hover {
          background: rgba(255, 255, 255, 0.08);
        }
      }
    }

    .Mui-selected {
      background: transparent;

      &:hover {
        background: rgba(255, 255, 255, 0.08);
      }
    }
  }

  .MuiTooltip-tooltip {
    background: #55596f;
    padding: 12px;
    border-radius: 8px;
  }

  .MuiTooltip-arrow {
    &:before {
      background: #55596f;
    }
  }

  .infinite-scroll-grid {
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    margin-top: -32px;
    width: calc(100% + 32px);
    margin-left: -32px;
    box-sizing: border-box;

    .MuiGrid-item {
      @media screen and (min-width: 992px) {
        flex-basis: 33.333333%;
        flex-grow: 0;
        max-width: 33.333333%;
      }

      padding-left: 32px;
      padding-top: 32px;
      box-sizing: border-box;
      margin: 0;
      flex-direction: row;
      flex-basis: 100%;
      max-width: 100%;
    }
  }

  a {
    transition: color 350ms !important;
  }

  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  
  input:-webkit-autofill,
  input:-webkit-autofill:hover,
  input:-webkit-autofill:focus,
  textarea:-webkit-autofill,
  textarea:-webkit-autofill:hover,
  textarea:-webkit-autofill:focus,
  select:-webkit-autofill,
  select:-webkit-autofill:hover,
  select:-webkit-autofill:focus {
    transition: all 5000s ease-in-out 0s;
  }
}
`;

export default GlobalStyles;
