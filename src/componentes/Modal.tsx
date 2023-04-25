import React, { Component } from "react";
import '../css/modal.css';

//Definindo interface para os props que a classe vai receber.
interface props {
    'data-name'?: string;
    user_id: number;
    show: boolean;
    onClose: Function,
}

// Definindo interface para o Payload
interface TransactionPayload {
    // Card Info
    card_number: string;
    cvv: number;
    expiry_date: string;
    destination_user_id: number;
    value: number;
}

//cartões de pagamento.
let cards = [
    {
        card_number: '1111111111111111',
        cvv: 789,
        expiry_date: '01/18',
    },
    {
        card_number: '4111111111111234',
        cvv: 123,
        expiry_date: '01/20',
    },
];

//API para requisição com informações de pagamento.
const api = `https://run.mocky.io/v3/533cd5d7-63d3-4488-bf8d-4bb8c751c989`;

//Criando classe do componente Modal.
class Modal extends Component<props>{
    state = {
        card_index: -1,
    }

    //Função para formatar o input do usuário para moeda
    formatCurrency(e: any) {
        const letterPattern = /[^0-9]/;
        if (letterPattern.test(e.key)) {
            e.preventDefault();
            return;
        }
        if (!e.currentTarget.value) return;

        let valor = e.currentTarget.value.toString();
        valor = valor.replace(/[\D]+/g, '');
        valor = valor.replace(/([0-9]{1})$/g, ",$1");

        if (valor.length >= 6) {
            while (/([0-9]{4})[,|.]/g.test(valor)) {
                valor = valor.replace(/([0-9]{1})$/g, ",$1");
                valor = valor.replace(/([0-9]{3})[,|.]/g, ".$1");
            }
        }

        e.currentTarget.value = valor;
    }
    payUser(id: number, valueToPay: number, card_index: number) {

        //Pegando o titulo do Modal e definindo como um elemento paragrafo de HTML (condutas do typescript)
        let headerTitle = document.getElementById("headerTitle") as HTMLParagraphElement

        //Criando um objeto com base na interface de Payload
        let payload: TransactionPayload = {
            card_number: cards[card_index].card_number,
            cvv: cards[card_index].cvv,
            expiry_date: cards[card_index].expiry_date,
            destination_user_id: id,
            value: valueToPay
        }

        //Criando requisição para a API e passando o objeto definido anteriormente como corpo da requisição.
        fetch(api, {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload),
        }).then((response) => {
            return response.json();
        }).then((data) => {
            headerTitle.textContent = "Recibo de pagamento";
            if (data.success) {
                document.getElementsByClassName("modalBody")[0].innerHTML = '<p class="paymentStatus">O pagamento foi concluido com sucesso.</p>';
            } else {
                document.getElementsByClassName("modalBody")[0].innerHTML = '<p class="paymentStatus">O pagamento <strong>não</strong> foi concluido com sucesso.</p>';
            }
        }).catch((err) => {
            headerTitle.textContent = "Recibo de pagamento";
            document.getElementsByClassName("modalBody")[0].innerHTML = '<p class="paymentStatus">O pagamento <strong>não</strong> foi concluido com sucesso.</p>';
        });
    }

    createModal() {
        if (!this.props.show) {
            return null;
        }

        //Retornando Modal case o show seja definido para True;
        return (
            <div className="modal" onClick={() => { this.props.onClose() }}>
                <div className="modalHeader" onClick={e => e.stopPropagation()}>
                    <p id="headerTitle">Pagamento para <span className="username">{this.props["data-name"]}</span></p>
                    <button className="closeBtn" onClick={() => { this.props.onClose() }}>X</button>
                </div>
                <div className="modalBody" onClick={e => e.stopPropagation()}>
                    <input placeholder="R$ 0,00" type="text" onKeyPress={(event) => { this.formatCurrency(event) }} />
                    <select name="creditCards" id="creditCards">
                        {
                            cards.map((card, index) => {
                                return (
                                    <option data-key={index} key={index} value={card.card_number}>{`Cartão com final ${card.card_number.slice(card.card_number.length - 4)}`}</option>
                                )
                            })
                        }
                    </select>
                    <button onClick={() => {
                        //Botão de pagar usuário
                        let valueToPay = document.getElementsByTagName('input')[0].value.replace(/[^0-9]/g, "");
                        let finalValue;
                        if (valueToPay.length > 1) {
                            finalValue = Number(valueToPay.substring(0, valueToPay.length - 2) + "." + valueToPay.substring(valueToPay.length - 2));
                        } else {
                            finalValue = Number(valueToPay);
                        }
                        let selectElement = document.getElementById("creditCards") as HTMLSelectElement;
                        let card_index = Number(selectElement.options[selectElement.selectedIndex].getAttribute("data-key"));
                        if (finalValue) {
                            this.payUser(this.props.user_id, finalValue, card_index)
                        } else {
                            document.getElementsByTagName('input')[0].focus();
                        }
                    }}>Pagar</button>
                </div>
            </div>
        )
    }

    render() {
        return (
            this.createModal()
        )
    }
}

export default Modal;