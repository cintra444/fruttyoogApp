import styled from "styled-components/native";


export const Container = styled.ScrollView.attrs(() => ({
    contentContainerStyle: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
}))`
    flex: 1;
    background-color: #f5f5f5;  
`;

export const FormWrapper = styled.View`
    width: 100%;
    max-width: 400px;
    background-color: #fff;
    border-radius: 8px;
    elevation: 2;
    padding: 16px;
`;
    
export const Title = styled.Text`
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 24px;
    color: #333;
    text-align: center;
`;