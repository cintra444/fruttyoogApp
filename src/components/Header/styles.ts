import styled from "styled-components/native";

export const HeaderContainer = styled.View`
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    background-color: #fff;
    border-bottom-width: 1px;
    border-color: #ddd;
`;

export const HeaderLeft = styled.View`
    flex: 1;
`;

export const HeaderCenter = styled.View`
    flex: 2;
    flex-direction: row;
    justify-content: center;
`;

export const HeaderRight = styled.View`
    flex: 1;
    align-items: flex-end;
`;

export const IconButton = styled.TouchableOpacity`
    margin-horizontal: 10px;
`;

export const VersionText = styled.Text`
    font-size: 16px;
    `;
    