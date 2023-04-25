import { Component } from 'react';
import '../css/lista.css';
import Modal from './Modal';

//Link da API para fazer o GET dos usuários
const api = `https://www.mocky.io/v2/5d531c4f2e0000620081ddce`;

//Modelo de interface que a API vai retornar.
interface User {
    id: string;
    name: string;
    img: string;
    username: string;
}

//Componente lista para gerar a lista com os usuários
class Lista extends Component<User>{
    state = {
        users: [],
        show: false,
        modalUsername: "",
        user_id: 0,
    }

    //Requisitar API quando a página terminar de carregar.
    componentDidMount = async () => {
        const response = await fetch(api);
        const obj: User = await response.json();
        this.setState({ users: obj });
    }

    //Função para criar a Lista e botão de pagamento
    createLi() {
        return this.state.users.map((user: User, index) => {
            return (
                <li className="user" key={user.id} id={user.id} data-name={user.name}>
                    <img className="userAvatar" src={user.img} alt="" />
                    <div className="userInfo">
                        <div>
                            <p className="username">{user.name}</p>
                            <p className="userID">ID: {user.id} - Username: {user.username}</p>
                        </div>
                        <div className="payButton">
                            <button onClick={() => {
                                this.setState({ show: true, modalUsername: user.name, user_id: user.id })
                            }}>Pagar</button>
                        </div>
                    </div>
                </li>
            )
        });
    }
    //Chamando o modal
    render() {
        return (
            <div>
                <Modal user_id={this.state.user_id} data-name={this.state.modalUsername} show={this.state.show} onClose={() => {this.setState({show: false})}}></Modal>
                <ul>
                    {this.createLi()}
                </ul>
            </div>
        )
    }
}


export default Lista;