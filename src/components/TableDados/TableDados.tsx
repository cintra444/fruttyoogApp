import React from 'react';
import { ScrollView } from 'react-native';
import { 
    Table,
    TableRow,
    TableHeader,
    TableCell,
    NoDataText,
 } from './styles';

interface TableDadosProps {
    data: Array<{ [key: string]: any }>;
}

const TableDados: React.FC<TableDadosProps> = ({ data }) => {
    if (data.length === 0) {
        return <NoDataText>Nenhum dado encontrado</NoDataText>;
    }

    const headers = Object.keys(data[0]);

    return (
        <ScrollView horizontal>
            <Table>
                <TableRow>
                    {headers.map((header) => (
                        <TableHeader key={header}>{header}</TableHeader>
                    ))}
                </TableRow>
                {data.map((item, index) => (
                    <TableRow key={index}>
                        {headers.map((header) => (
                            <TableCell key={header}>{item[header]}</TableCell>
                        ))}
                    </TableRow>
                ))}
            </Table>
        </ScrollView>
    );
};


export default TableDados;