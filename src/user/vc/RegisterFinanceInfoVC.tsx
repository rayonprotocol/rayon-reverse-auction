import React, { Component, Fragment } from 'react';

// model
import User, { FinanceData } from 'user/model/User';
import { RAYON_BERRY, RAYON_LAKE } from 'common/model/Style';

// dc
import UserDC from 'user/dc/UserDC';

// view
import Container from 'common/view/container/Container';
import RayonButton from 'common/view/button/RayonButton';
import RayonModalView from 'common/view/modal/RayonModalView';

// styles
import styles from './RegisterFinanceInfoVC.scss';

interface RegisterFinanceInfoVCState {
  financeData: FinanceData[];
  inputLength: number;
  user: User;
  isModalOpen: boolean;
}

class RegisterFinanceInfoVC extends Component<{}, RegisterFinanceInfoVCState> {
  constructor(props) {
    super(props);
    this.state = {
      ...this.state,
      inputLength: 1,
      financeData: new Array<FinanceData>(),
      user: UserDC.getUser(),
      isModalOpen: false,
    };
  }

  componentWillMount() {
    const userFinanceData = UserDC.getUserFinanceData();
    if (userFinanceData === null) return;
    const keys = Object.keys(userFinanceData);
    const financeData: FinanceData[] = new Array<FinanceData>();

    keys.map(item => {
      const newFinanceData = {
        dataKeys: item,
        dataValues: userFinanceData[item],
      };
      financeData.push(newFinanceData);
    });

    this.setState({ ...this.state, financeData });
  }

  onChangeDataKeyText(event, index: number) {
    console.log(event.target.value);
    this.state.financeData[index].dataKeys = event.target.value;
    this.setState({ ...this.state, financeData: this.state.financeData });
  }

  onChangeDataValueText(event, index: number) {
    console.log(event.target.value);
    this.state.financeData[index].dataValues = event.target.value;
    this.setState({ ...this.state, financeData: this.state.financeData });
  }

  async onClickSubmitButton() {
    const object: Object = {};
    this.state.financeData.forEach(item => {
      object[item.dataKeys] = item.dataValues;
    });
    localStorage.setItem(UserDC.getUserAccount(), JSON.stringify(object));
    this.setState({ ...this.state, isModalOpen: true });
  }

  onClickAddInputButton() {
    const newFinanceData = {
      dataKeys: '',
      dataValues: '',
    };
    this.state.financeData.push(newFinanceData);
    this.setState({ ...this.state, financeData: this.state.financeData });
  }

  onClickRemoveInputButton(index: number) {
    if (this.state.financeData.length === 1) return alert("can't remove last property");
    this.state.financeData.splice(index, 1);
    this.setState({ ...this.state, financeData: this.state.financeData });
  }

  onRequestCloseModal() {
    this.setState({ ...this.state, isModalOpen: false });
  }

  render() {
    console.log(this.state.financeData);
    return (
      <Fragment>
        <Container className={styles.contentsContainer}>
          <Fragment>
            <div className={styles.titleSection}>
              <p className={styles.title}>Register Data</p>
              <RayonButton
                className={styles.addBtn}
                title={'Add Data'}
                onClickButton={this.onClickAddInputButton.bind(this)}
                buttonColor={this.state.user.isBorrower ? RAYON_LAKE : RAYON_BERRY}
              />
            </div>
            <table>
              <tbody>
                <tr className={styles.headerRow}>
                  <th>ID</th>
                  <th>Data</th>
                  <th>Value</th>
                  <th>Remove</th>
                </tr>
                {this.state.financeData.map((item, index) => {
                  return (
                    <tr key={index} className={styles.inputRow}>
                      <td className={styles.id}>{index + 1}</td>
                      <td>
                        <input
                          onChange={event => this.onChangeDataKeyText(event, index)}
                          type={'text'}
                          value={this.state.financeData[index].dataKeys}
                        />
                      </td>
                      <td>
                        <input
                          onChange={event => this.onChangeDataValueText(event, index)}
                          type={'text'}
                          value={this.state.financeData[index].dataValues}
                        />
                      </td>
                      <td className={styles.removeBtn}>
                        <div onClick={() => this.onClickRemoveInputButton(index)}>x</div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <RayonButton
              className={styles.dataSaveBtn}
              title={'Save'}
              onClickButton={this.onClickSubmitButton.bind(this)}
              buttonColor={this.state.user.isBorrower ? RAYON_LAKE : RAYON_BERRY}
            />
          </Fragment>
        </Container>
        <RayonModalView onRequestClose={this.onRequestCloseModal.bind(this)} isModalOpen={this.state.isModalOpen}>
          <p> Your personal data was successfully saved</p>
          <RayonButton
            className={styles.confirmButton}
            title={'Confirm'}
            onClickButton={this.onRequestCloseModal.bind(this)}
            buttonColor={this.state.user.isBorrower ? RAYON_LAKE : RAYON_BERRY}
          />
        </RayonModalView>
      </Fragment>
    );
  }
}

export default RegisterFinanceInfoVC;
