import React, { Component } from 'react';
import { Text, StyleSheet, ScrollView, TextInput, Dimensions, TouchableHighlight, Alert, } from 'react-native';
import { openDatabase } from 'react-native-sqlite-storage'; // to DataBase
import { Header, Left, Right, Body, Title, Icon, Container, } from 'native-base'
import AntDesign from 'react-native-vector-icons/AntDesign'



const db = openDatabase({
    name: 'posqlitExmple.db',
    createFromLocation: '~www/sqlitExmple.db'
},
    (good) => { //in case of success print in the Console
        console.log('OpenMensaje', good)
    },
    (err) => { // in case of error print in the Console
        console.log('errorMensaje', err)
    }
);
class AddNewPrestamo extends Component {
    constructor() {
        super()
        this.state = {
            Monto: '',
            Nombre: '',
            concepto: '',
            usuario: '',
            date: ''
        }
    }
    render() {
        return (
            <Container>
                <Header style={{ backgroundColor: '#5564eb', width: Dimensions.get('window').width, }}>
                    <Left>
                        <AntDesign name="menuunfold" style={{ paddingLeft: 10 }} onPress={() => this.props.navigation.openDrawer()} color='white' size={25} />
                    </Left>
                    <Body>
                        <Title style={{ color: 'white', fontSize: 20, }}> CarterApp</Title>
                    </Body>
                    <Right />

                </Header>


                <ScrollView>
                    <Body>
                        <Text style={styles.title}> {this.props.scrn} </Text>
                        <TextInput style={styles.textIn} autoFocus={true} keyboardType='numeric' placeholderTextColor='grey' placeholder='Monto' onChangeText={(text) => this.setState({ Monto: text })} onSubmitEditing={(event) => { this.refs._2.focus(); }} />
                        <TextInput style={styles.textIn} placeholderTextColor='grey' placeholder={this.props.Txt} onChangeText={(text) => this.setState({ Nombre: text })} ref='_2' onSubmitEditing={(event) => { this.refs._3.focus(); }}/>
                        <TextInput style={styles.textInConcepto} words={true} multiline={true} placeholderTextColor='grey' placeholder='concepto' onChangeText={(text) => this.setState({ concepto: text })} ref='_3' />
                        <TouchableHighlight onPress={(this.onAdd.bind(this))} style={styles.button}>
                            <Text style={styles.textButton}> Add </Text>
                        </TouchableHighlight>
                    </Body>
                </ScrollView>



            </Container>


        );
    }

    onAdd() {
        const date = new Date().getDate(); //Current Date
        const month = new Date().getMonth() + 1; //Current Month
        const year = new Date().getFullYear(); //Current Year
        this.setState({
            //Setting the value of the date time
            date:
                //date + '/' + month + '/' + year + ' ' + hours + ':' + min + ':' + sec,
                date + '/' + month + '/' + year,
        });

        const { Monto } = this.state
        const { Nombre } = this.state
        const { concepto } = this.state

        const { params } = this.props.navigation.state;

        this.setState({ usuario: params.usuario })
        //INSERT INTO DebenList (Monto,Nombre,Concepto,Fecha,Usuario) VALUES(1000,"alguien","uBER","20/1/20","ADMIN")

        if (Monto == '' || isNaN(Monto)) {
            alert('Recuerde que el campo monto debe estar lleno y ser un valor numerico');
        } else {
            console.log(params.usuario)
            db.transaction(tx => {
                console.log(this.props.TypeList + params.usuario)
                tx.executeSql(`INSERT INTO ${this.props.TypeList} (Monto,Nombre,Concepto,Fecha,Usuario) VALUES(?,?,?,?,?)`,
                    [Monto, Nombre, concepto, this.state.date, this.state.usuario], (tx, results) => {
                        console.log('Results', results.rowsAffected);
                        if (results.rowsAffected > 0) {
                            Alert.alert(
                                'Success',
                                'You are Registered Successfully',
                                [
                                    {
                                        text: 'Ok',
                                        onPress: () =>
                                            this.props.navigation.navigate('Home'),
                                    },
                                ],
                                { cancelable: false }
                            );
                        } else {
                            alert('Registration Failed');
                        }
                    })
            })
        }
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        backgroundColor: 'white',
    },
    title: {
        marginTop: 25,
        fontSize: 20,
        color: 'black',
    },
    header: {
        flex: 0.1,
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        backgroundColor: '#5564eb',
        marginTop: 0,
        width: Dimensions.get('window').width,
    },
    body: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        backgroundColor: 'white',
    },
    button: {
        width: 150,
        height: 30,
        backgroundColor: '#5564eb',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 70,
        marginBottom: 10,
        borderRadius: 8,
        borderWidth: 1
    },
    textButton: {
        color: '#F5F5DC',
    },

    textIn: {
        marginTop: 45,
        width: 270,
        height: 40,
        borderBottomWidth: 2,
        color: 'black',
        borderBottomColor: 'grey'
    },
    textInConcepto: {
        marginTop: 45,
        width: 270,
        height: 100,
        borderBottomWidth: 2,
        color: 'black',
        borderBottomColor: 'grey'
    },
})

module.exports = AddNewPrestamo;