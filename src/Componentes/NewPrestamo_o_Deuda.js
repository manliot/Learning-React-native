import React, { Component } from 'react';
import { Text, StyleSheet, ScrollView, TextInput, Dimensions, TouchableHighlight, Alert, } from 'react-native';
import { Body, Container, View, } from 'native-base'
import { connect } from 'react-redux'
import { RefreshDeudasTrue, RefreshPrestamoTrue, RefreshTrue } from '../actions/actions'

import actualizar from '../utils/actualizar'

import { UpdateDEBEN, UpdateDEBES } from '../actions/actions'

class AddNewPrestamo extends Component {
  constructor() {
    super()
    this.state = {
      Monto: '',
      Nombre: '',
      concepto: '',
      date: ''
    }
  }
  render() {
    return (
      <Container>
        <ScrollView>
          <Body>
            <TextInput style={styles.textIn2} autoFocus={true} placeholderTextColor='grey' placeholder={this.props.Txt + "*"} onChangeText={(text) => this.setState({ Nombre: text })} onSubmitEditing={(event) => { this.refs._2.focus(); }} />
            <TextInput style={styles.textIn} keyboardType='numeric' placeholderTextColor='grey' placeholder={this.props.Monto + "*"} onChangeText={(text) => this.setState({ Monto: text })} ref='_2' onSubmitEditing={(event) => { this.refs._3.focus(); }} />
            <TextInput style={styles.textInConcepto} words={true} multiline={true} placeholderTextColor='grey' placeholder={this.props.Concepto} onChangeText={(text) => this.setState({ concepto: text })} ref='_3' />
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
      date: `${month}/${date}/${year}`
    });
    const { Monto, Nombre, concepto } = this.state
    if (Monto == '' || isNaN(Monto)) {
      alert('Recuerde que el campo monto debe estar lleno y ser un valor numerico');
    } else {
      this.props.db.transaction(tx => {
        tx.executeSql(`INSERT INTO ${this.props.TypeList} (Monto,Nombre,Concepto,Fecha,Usuario) VALUES(?,?,?,?,?)`,
          [Monto, Nombre, concepto, this.state.date, this.props.usuario], (tx, results) => {
            if (results.rowsAffected > 0) {
              Alert.alert(
                'Success',
                'You are Registered Successfully',
                [
                  {
                    text: 'Ok',
                    onPress: () => {
                      actualizar(`SELECT Monto FROM ${this.props.TypeList} WHERE Usuario =?`, this.props.usuario, this.props.db)
                        .then((res) => {
                          if (this.props.TypeList === 'DeboList') {
                            this.props.RefreshDeudasTrue()
                            this.props.UpdateDEBES_(res)
                          } else {
                            this.props.RefreshPrestamoTrue()
                            this.props.UpdateDEBEN_(res)
                          }
                          this.props.RefreshTrue()
                          this.props.navigation.navigate('Home')
                        })
                        .catch((err) => {
                          console.error(new Error(err))
                        })

                    },
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
    marginTop: 13,
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
    width: 250,
    height: 40,
    backgroundColor: '#5564eb',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 70,
    marginBottom: 10,
    borderRadius: 20,
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
  textIn2: {
    marginTop: 70,
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

const mapStateToProps = (state) => {
  return {
    db: state.db,
    usuario: state.usuario,
  }
}
const mapDispathToProps = (dispath) => {
  return {
    RefreshDeudasTrue: () => dispath(RefreshDeudasTrue()),
    RefreshPrestamoTrue: () => dispath(RefreshPrestamoTrue()),
    RefreshTrue: () => dispath(RefreshTrue()),
    UpdateDEBEN_: (deben) => dispath(UpdateDEBEN(deben)),
    UpdateDEBES_: (debes) => dispath(UpdateDEBES(debes)),
  }
}
export default connect(mapStateToProps, mapDispathToProps)(AddNewPrestamo);