export class CaixaDaLanchonete {
    constructor() {
        this.menu = [
            {'codigo': 'cafe', 'valor': 3},
            {'codigo': 'chantily', 'valor': 1.50},
            {'codigo': 'suco', 'valor': 6.20},
            {'codigo': 'sanduiche', 'valor': 6.50},
            {'codigo': 'queijo', 'valor': 2},
            {'codigo': 'salgado', 'valor': 7.25},
            {'codigo': 'combo1', 'valor': 9.50},
            {'codigo': 'combo2', 'valor': 7.50}
        ];
    }

    calcularValorDaCompra(forma_pagamento, itens) {
        if (forma_pagamento.search(/debito|credito|dinheiro/gi) === -1) {
            return 'Forma de pagamento inválida!';
        }
        if (itens.length < 1) {
            return 'Não há itens no carrinho de compra!';
        }
        if (!this.hasValidQuantity(itens))
            return 'Quantidade inválida!'

        if (!this.hasValidItems(itens)) {
            return 'Item inválido!';
        }

        if (!this.hasItemPrincipal(itens)) {
            return 'Item extra não pode ser pedido sem o principal'
        }

        const subtotal = this.calculateSubtotal(itens);

        const total = this.applySpecialPrice(subtotal, forma_pagamento);

        return this.formatPrice(total)
    }


    hasValidQuantity(itens) {
        return itens.reduce((prev, current) => {
            if (!prev)
                return false
            return !current.includes("0");
        }, true)
    }

    hasItemPrincipal(itens) {
        const codigoList = itens.map(iten => this.getPriceFromIten(iten))
        let isExtraWithPrincipais = true
        if (codigoList.includes('chantily') && !codigoList.includes('cafe'))
            isExtraWithPrincipais = false
        if (codigoList.includes('queijo') && !codigoList.includes('sanduiche'))
            isExtraWithPrincipais = false
        return isExtraWithPrincipais
    }

    hasValidItems(itens) {
        return itens.reduce((prev, currentIten) => {
            if (!prev)
                return false
            const currentItenCodigo = this.getPriceFromIten(currentIten);
            return this.menu.find(item => item.codigo === currentItenCodigo);
        }, true)
    }

    getPriceFromIten(iten) {
        return iten.split(',')[0]
    }

    calculateSubtotal(itens) {
        return itens.reduce((prev, iten) => {
            const [codigo, quantia] = iten.split(',');
            const menuIten = this.menu.find(val => val.codigo === codigo)
            return prev + (quantia * menuIten.valor)
        }, 0)
    }

    applySpecialPrice(subtotal, forma_pagamento) {
        if (forma_pagamento === 'dinheiro') {
            return subtotal - (subtotal * 0.05);
        } else if (forma_pagamento === 'credito') {
            return subtotal + (subtotal * 0.03);
        }
        return subtotal
    }

    formatPrice(total) {
        return `R$ ${total.toFixed(2).replace('.', ',')}`;
    }
}
