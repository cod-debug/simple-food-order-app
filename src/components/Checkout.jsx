import { useContext } from "react";
import CartContext from "../store/CartContext";
import Modal from "./UI/Modal";
import { currencyFormatter } from "../util/Formatting";
import Input from "./UI/Input";
import Button from "./UI/Button";
import UserProgressContext from "../store/UserProgressContext";

export default function Checkout() {
    const cartCtx = useContext(CartContext);
    const cartTotal = cartCtx.items.reduce((totalAmount, item) => totalAmount + item.quantity * item.price, 0);
    const userProgressCtx = useContext(UserProgressContext);

    function handleClose(){
        userProgressCtx.hideCheckout();
    }

    return (<Modal open={userProgressCtx.progress === 'checkout'}>
        <form>
            <h2>Checkout</h2>
            <p>Total Amount: { currencyFormatter.format(cartTotal) }</p>
            <Input label="Full Name" type="text" id="full-name" required />
            <Input label="E-mail Address" type="email" id="email" required />
            <Input label="Street" type="text" id="street" required />
            <div className="control-row">
                <Input label="Postal Code" type="text" id="postal-code" required />
                <Input label="City" type="text" id="city" required />
            </div>
            <p className="modal-actions">
                <Button textOnly type="button" onClick={handleClose} >Close</Button>
                <Button>Submit Order</Button>
            </p>
        </form>
    </Modal>)
}