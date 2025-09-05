import styled from "styled-components/native";

export const Table = styled.View`
    border-width: 1px;
    border-color: #ddd;
`;

export const TableRow = styled.View`
    flex-direction: row;
`;

export const TableHeader = styled.Text`
    flex: 1;
    padding: 8px;
    background-color: #f1f1f1;
    font-weight: bold;
    border-width: 1px;
    border-color: #ddd;
`;

export const TableCell = styled.Text`
    flex: 1;
    padding: 8px;
    border-width: 1px;
    border-color: #ddd;
`;

export const NoDataText = styled.Text`
    text-align: center;
    margin-top: 20px;
    font-size: 16px;
`;
   