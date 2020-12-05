import { Theme } from "@material-ui/core";

// styled-componentsのDefaultThemeにmaterial-uiのThemeを継承させてstyled-components内で型が補完されるようにする
declare module "styled-components" {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface DefaultTheme extends Theme {}
}
