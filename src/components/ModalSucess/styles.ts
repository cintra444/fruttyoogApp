
import styled  from "styled-components/native";


export const CenteredView = styled.View`
    flex: 1;
    justify-content: center;
    align-items: center;
    marginTop: 22;
`;

export const ModalView = styled.View`
    margin: 20px;
    background-color: white;
    border-radius: 20px;
    padding: 35px;
    align-items: center;
    shadow-color: #000;
    shadow-offset: {
        width: 0px;
        height: 2px;
    };
    shadow-opacity: 0.25;
    shadow-radius: 4px;
    elevation: 5px;
`;

export const ModalText = styled.Text`
    margin-bottom: 15px;
    text-align: center;
`;

export const ButtonModal = styled.TouchableOpacity`
    background-color: #2196F3;
    border-radius: 20px;
    padding: 10px;
    elevation: 2px;
`;


export const ButtonTextModal = styled.Text`
    color: white;
    font-weight: bold;
    text-align: center;
`;

   