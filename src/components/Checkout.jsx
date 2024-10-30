import { useContext } from "react";
import CartContext from "../store/CartContext";
import Modal from "./UI/Modal";
import { currencyFormatter } from "../util/Formatting";
import Input from "./UI/Input";
import Button from "./UI/Button";
import UserProgressContext from "../store/UserProgressContext";
import useHttp from "../hooks/useHttp";
import Error from "./Error";

const requestConfig = {
    method: "POST",
    headers: {
        'Content-Type': 'application/json'
    },
}
export default function Checkout() {
    const cartCtx = useContext(CartContext);
    const cartTotal = cartCtx.items.reduce((totalAmount, item) => totalAmount + item.quantity * item.price, 0);
    const userProgressCtx = useContext(UserProgressContext);

    const {data, isLoading: isSending, error, sendRequest, clearCart} = useHttp('http://localhost:3000/orders', requestConfig);

    function handleClose(){
        userProgressCtx.hideCheckout();
    }

    function handleFinish(){
        userProgressCtx.hideCheckout();
        clearCart();
    }

    function handleSubmit(event){
        event.preventDefault();

        const fd = new FormData(event.target);
        const customerData = Object.fromEntries(fd.entries());

        sendRequest(
            JSON.stringify({
                order: {
                    items: cartCtx.items,
                    customer: customerData,
                }
            })
        );
    }

    let actions = (
        <>
            <Button textOnly type="button" onClick={handleClose} >Close</Button>
            <Button>Submit Order</Button>
        </>
    )

    if(isSending){
        actions = <span>Sending order data...</span>
    }

    if(data && !error){
        return (<Modal open={userProgressCtx.progress === 'checkout'} onClose={handleClose}>
            <h2>Success!</h2>
            <p>Your order was submitted successfully.</p>
            <p>We will get back to you with more details via email within the next few minutes</p>
            <p className="modal-actions">
                <Button onClick={handleFinish}>Okay</Button>
            </p>
        </Modal>)
    }

    return (<Modal open={userProgressCtx.progress === 'checkout'} onClose={userProgressCtx.progress === 'checkout' ? handleClose : null}>
        <form onSubmit={handleSubmit}>
            <h2>Checkout</h2>
            <p>Total Amount: { currencyFormatter.format(cartTotal) }</p>
            <Input label="Full Name" type="text" id="name" required />
            <Input label="E-mail Address" type="email" id="email" required />
            <Input label="Street" type="text" id="street" required />
            <div className="control-row">
                <Input label="Postal Code" type="text" id="postal-code" required />
                <Input label="City" type="text" id="city" required />
            </div>
            {error && <Error title="Failed to submit order!" message={error} />}
            <p className="modal-actions">{actions}</p>
        </form>
    </Modal>)
}