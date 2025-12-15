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
export const PriceInputContainer = styled.View`
  flex-direction: row;
  align-items: center;
`;

export const PriceInput = styled(StyledInput)`
  flex: 1;
  margin-right: 10px;
`;

export const PriceButton = styled.TouchableOpacity`
  background-color: #28a745;
  padding: 10px 15px;
  border-radius: 5px;
  align-items: center;
  justify-content: center;
`;

export const PriceButtonText = styled.Text`
  color: white;
  font-size: 12px;
  font-weight: bold;
`;

export const ReferencePrice = styled.Text`
  font-size: 12px;
  color: #6c757d;
  margin-top: 5px;
  font-style: italic;
`;

export const UpdateReferenceCheckbox = styled.View`
  background-color: #f8f9fa;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 20px;
`;

export const CheckboxLabel = styled.Text`
  font-size: 14px;
  color: #333;
  flex: 1;
`;
export const Column = styled.View`
  flex: 1;
  margin-right: 10px;
`;

export const FormRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 15px;
  
  &:last-child {
    margin-right: 0;
  }
`;
export const InfoCard = styled.View`
  background-color: #e3f2fd;
  padding: 12px;
  border-radius: 8px;
  margin-top: 10px;
  border-left-width: 4px;
  border-left-color: #2196f3;
`;

export const InfoCardText = styled.Text`
  color: #1565c0;
  font-size: 14px;
`;
export const LoadingContainer = styled.View`
  padding: 20px;
  align-items: center;
  justify-content: center;
`;

export const LoadingText = styled.Text`
  font-size: 16px;
  color: #666;
  margin-top: 10px;
`;
export const CardContainer = styled.View`
  flex-direction: column;
  border-radius: 8px;
  background-color: #fff;
  border: 1px solid #e0e0e0;
  overflow: hidden;
`;
export const CardTouchable = styled.TouchableOpacity`
  padding: 15px 20px;
  border-bottom-width: 1px;
  border-bottom-color: #f0f0f0;
  background-color: #fff;
`;
export const CardTitle = styled.Text`
  font-size: 16px;
  color: #333;
  margin-bottom: 5px;
`;