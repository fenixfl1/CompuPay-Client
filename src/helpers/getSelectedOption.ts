import { MenuOption } from "@/interfaces/user"
import jsonParse from "./jsonParse"

/**
 * This function is used to get the selected menu option selected from session storage
 */
function getSelectedOption(): MenuOption {
  try {
    const selectedOption = sessionStorage.getItem("selectedOption")
    return jsonParse<MenuOption>(
      sessionStorage.getItem("selectedMenuOption") as string
    )
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error({ error })
    return <MenuOption>{}
  }
}

export default getSelectedOption
