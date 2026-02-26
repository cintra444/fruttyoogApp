declare module "react-native-vector-icons/MaterialCommunityIcons" {
  import type { ComponentType } from "react";

  type IconProps = {
    name: string;
    size?: number;
    color?: string;
    style?: unknown;
    [key: string]: unknown;
  };

  const Icon: ComponentType<IconProps>;
  export default Icon;
}
