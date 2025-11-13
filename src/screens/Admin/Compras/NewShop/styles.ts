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

export const ItemContainer = styled.View`
background-color: #f8f9fa;
  padding: 15px;
  margin-bottom: 15px;
  border-radius: 8px;
  border-left-width: 4px;
  border-left-color: #007bff;
`;

export const ItemRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;

export const RemoveItemButton = styled.TouchableOpacity`
  background-color: #dc3545;
  width: 30px;
  height: 30px;
  border-radius: 15px;
  justify-content: center;
  align-items: center;
`;

export const AddButton = styled.TouchableOpacity`
  background-color: #28a745;
  padding: 12px;
  border-radius: 8px;
  align-items: center;
  margin-bottom: 20px;
`;

export const SectionTitle = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: #333;
  margin-bottom: 15px;
  margin-top: 10px;
`;

export const TotalText = styled.Text`
  font-size: 20px;
  font-weight: bold;
  color: #28a745;
  text-align: center;
  margin: 20px 0;
`;
export const BackButton = styled.TouchableOpacity`
flex-direction: row;
align-items: center;
margin-top: 20px;
margin-left: 10px;
`;
export const BackButtonText = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: #007bff;
  margin-left: 8px;
`;
