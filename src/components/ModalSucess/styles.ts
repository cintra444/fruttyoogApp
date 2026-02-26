
import styled  from "styled-components/native";


export const CenteredView = styled.View`
    flex: 1;
    justify-content: center;
    align-items: center;
    background-color: rgba(15, 23, 42, 0.45);
    padding: 16px;
`;

export const ModalView = styled.View`
    width: 100%;
    max-width: 340px;
    background-color: white;
    border-radius: 16px;
    padding: 24px;
    align-items: center;
    shadow-color: #000;
    shadow-offset: 0px 2px;
    shadow-opacity: 0.25;
    shadow-radius: 4px;
    elevation: 5;
`;

export const ModalText = styled.Text`
    margin-bottom: 16px;
    text-align: center;
    color: #0f172a;
    font-size: 15px;
`;

export const ButtonModal = styled.TouchableOpacity`
    background-color: #0f766e;
    border-radius: 10px;
    padding: 10px 20px;
    elevation: 2;
`;


export const ButtonTextModal = styled.Text`
    color: white;
    font-weight: bold;
    text-align: center;
`;

   
