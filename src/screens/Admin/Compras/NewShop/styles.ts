import styled from "styled-components/native";
import { Picker } from "@react-native-picker/picker";

export const Container = styled.View`
  flex: 1;
  padding: 24px;
  background: #fff;
`;

export const Title = styled.Text`
  font-size: 22px;
  text-align: center;
  margin-bottom: 24px;
`;

export const FormGroup = styled.View`
  margin-bottom: 18px;
`;

export const Label = styled.Text`
  margin-bottom: 6px;
  font-weight: 500;
`;

export const StyledPicker = styled(Picker)`
  width: 100%;
  background: #f5f5f5;
  margin-bottom: 8px;
`;

export const PickerItem = Picker.Item;

export const StyledInput = styled.TextInput`
  width: 100%;
  padding: 8px;
  border-radius: 6px;
  border-width: 1px;
  border-color: #ccc;
  margin-bottom: 8px;
`;

export const SubmitButton = styled.TouchableOpacity`
  margin-top: 18px;
  padding: 12px;
  background: #007bff;
  border-radius: 8px;
  align-items: center;
`;

