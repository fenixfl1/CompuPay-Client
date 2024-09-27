import { SECONDARY_BG_COLOR } from "@/constants/colors"
import { createGlobalStyle } from "styled-components"

const GlobalStyles = createGlobalStyle`
  @layer base {
    :root {
      --chart-1: 12 76% 61%;
      --chart-2: 173 58% 39%;
      --chart-3: 197 37% 24%;
      --chart-4: 43 74% 66%;
      --chart-5: 27 87% 67%;
    }

    .dark {
      --chart-1: 220 70% 50%;
      --chart-2: 160 60% 45%;
      --chart-3: 30 80% 55%;
      --chart-4: 280 65% 60%;
      --chart-5: 340 75% 55%;
    }
  }

  * {
    box-sizing: border-box;
    padding: 0;
    margin: 0;
  }

  body {
    background-color: ${SECONDARY_BG_COLOR} !important;
  }

  .ant-layout-content {
    margin: 24px 16px 0;
  }

  .editable-cell {
    position: relative;
  }

  .editable-cell-value-wrap {
    padding: 5px 12px;
    cursor: pointer;
  }

  .editable-row:hover .editable-cell-value-wrap {
    padding: 4px 11px;
    border: 1px solid #d9d9d9;
    border-radius: 2px;
  }

  .ui-container {
    width: 100% !important;
    max-width: 1200px !important;
    margin: 0 auto !important;
    padding: 0 15px !important;
    background-color: red !important;
    height: 100vh !important;
  }

  .payroll-processed {
    color: #73d13d !important;
  }

  .notification-dropdown {

    .ant-dropdown-menu-item:not(:last-child) {
      position: relative;

      &:before {
        content: "";
        border: 1px solid #f0f4f6;
        width: 100%;
        position: absolute;
        left: 0;
        bottom: 0;
      }
    }
  }
`

export default GlobalStyles
