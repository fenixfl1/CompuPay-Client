import { SECONDARY_BG_COLOR } from "@/constants/colors"
import { createGlobalStyle } from "styled-components"

const GlobalStyles = createGlobalStyle`
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
`

export default GlobalStyles
