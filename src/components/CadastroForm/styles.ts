import styled from "styled-components/native";
import { Dimensions, Platform, PixelRatio } from "react-native";

const { width, height } = Dimensions.get('window');
const scaleFont = (size: number): number => size * PixelRatio.getFontScale();

export const Container = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  padding-horizontal: ${width * 0.05}px;
  padding-vertical: ${height * 0.02}px;
`;

export const Label = styled.Text`
  font-size: ${scaleFont(16)}px;
  margin-bottom: ${height * 0.01}px;
  color: #000;
  align-self: flex-start;
`;
  
export const Input = styled.TextInput`
  width: 100%;
  height: ${height * 0.06}px;
  border-color: #ccc;
  border-width: 1px;
  margin-bottom: ${height * 0.015}px;
  padding-horizontal: ${width * 0.02}px;
  border-radius: 6px;
  background-color: ${Platform.OS === 'ios' ? '#f8f8f8' : '#ffffff'};
  color: #000;
`;
  
export const Button = styled.TouchableOpacity`
  background-color: #005006;
  padding-vertical: ${height * 0.015}px;
  border-radius: 6px;
  margin-vertical: ${height * 0.02}px;
  align-items: center;
  width: 100%;
`;

export const ButtonText = styled.Text`
  color: #1D71B8;
  font-size: ${scaleFont(18)}px;
  font-weight: bold;
`;

export const Image = styled.Image`
  width: 200px;
  height: 200px;
  border-radius: 10px;
  margin-top: 10px;
  `;