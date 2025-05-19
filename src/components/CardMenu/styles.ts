import styled from 'styled-components/native';

export const CardContainer = styled.TouchableOpacity`
    background-color: #fff;
    padding: 12px;
    margin-vertical: 10px;
    margin-horizontal: 20px;
    align-items: center;
    justify-content: center;
    border-color: #000;
    width: 80%;
    border-radius: 40px;
    margin-top: 215px;
`;

export const IconContainer = styled.View`
    margin-bottom: 10px;
`;

export const CardContent = styled.View`
    margin-top: 10px;
    align-items: center;
`;

export const Title = styled.Text`
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 5px;
`;

export const Description = styled.Text`
    font-size: 14px;
    color: #808080;
`;