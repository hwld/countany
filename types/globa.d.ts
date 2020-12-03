import { Theme } from "@material-ui/core";
import { PrismaClient, PrismaClientOptions } from "@prisma/client";

// styled-componentsのDefaultThemeにmaterial-uiのThemeを継承させてstyled-components内で型が補完されるようにする
declare module "styled-components" {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface DefaultTheme extends Theme {}
}

declare global {
  namespace NodeJS {
    interface Global {
      prisma: PrismaClient<PrismaClientOptions, never>;
    }
  }
}
