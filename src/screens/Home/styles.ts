import styled from "styled-components/native";


export const Container = styled.View`
    flex: 1;
    justify-content: center;
    align-items: center;
    padding: 16px;
    background-color: #ffffff;
    padding: 20px;
`;

export const Logo = styled.Image`
    width: 80%;
    height: 20%;
    resize-mode: contain;
    margin-bottom: 20px;
`;

export const WelcomeText = styled.Text`
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 20px;
    text-align: center;
    color: #000;
`;


export const QuestionText = styled.Text`
    font-size: 18px;
    margin-bottom: 20px;
    text-align: center;
    color: #000;
`;
    
export const Button = styled.TouchableOpacity`
    background-color: #005006;
    padding: 10px;
    border-radius: 5px;
    margin-bottom: 10px;
    width: 80%;
    align-items: center;
`;

export const ButtonText = styled.Text`
    color: #1D71B8;
    font-weight: bold;
    font-size: 24px;
`;

export const AdminButton = styled.TouchableOpacity`
    background-color: #FFA500;
    padding: 10px;
    border-radius: 5px;
    margin-bottom: 10px;
    width: 80%;
    align-items: center;
`;
export const AdminButtonText = styled.Text`
    color: #fff;    
    font-weight: bold;
    font-size: 24px;
`;
   