import { TokenResult } from "@square/web-payments-sdk-types";
import { FormEvent, useEffect, useState } from "react";
import { Accordion, Button, Card, CloseButton, Col, Container, Form, ListGroup, Modal, Row, Spinner, Toast, ToastContainer } from "react-bootstrap";
import { PaymentForm, CreditCard } from "react-square-web-payments-sdk";
import { CatalogObject, Order, } from "square";

const states = ["AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "DC", "FL", "GA", "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WI", "WV", "WY"];

function getItemPrice(item: CatalogObject) {
    const prices: number[] = [];
    item.itemData?.variations?.forEach(variation => {
        const price = variation.itemVariationData?.priceMoney?.amount;
        const num = Number(price) / 100;
        if (price && !prices.some(x => x === num)) prices.push(num);
    })
    prices
    if (prices.length > 1) {
        const minPrice = Math.min.apply(null, prices);
        const maxPrice = Math.max.apply(null, prices);
        return `$${minPrice} - $${maxPrice}`;
    } else return `$${prices[0]}`;
}

const Shop = () => {
    const [loading, setLoading] = useState(true);
    const [catalog, setCatalog] = useState<CatalogObject[]>([]);
    const [order, setOrder] = useState<Order>();
    const [show, setShow] = useState(false);
    const [modalItem, setModalItem] = useState<CatalogObject>();
    const [addedItems, setAddedItems] = useState<{ lineItemId: string, quantity: string }[]>([]);
    const [itemQuantities, setItemQuantities] = useState<{ id: string, quantity: string }[]>([]);
    const [activeKey, setActiveKey] = useState("0");
    const [fulfillment, setFulfillment] = useState("");
    const [validated, setValidated] = useState(false);
    const [uspsResponse, setUspsResponse] = useState("");
    const [error, setMessage] = useState("");
    const [showToast, setShowToast] = useState(false);
    const [toastState, setToastState] = useState("");
    const [displayName, setDisplayName] = useState("");
    const [emailAddress, setEmailAddress] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [address1, setAddress1] = useState("");
    const [address2, setAddress2] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [zipcode, setZipcode] = useState("");    
    const [fulfillmentSaved, setFulfillmentSaved] = useState(false);
    const [paymentKey, setPaymentKey] = useState(Math.floor(Math.random() * 1000));

    useEffect(() => {
        const page = window.location.pathname;
        const orderId = document.cookie.split('; ').find(x => x.startsWith('orderId'))?.split('=')[1];
        if (orderId) {
            fetch(`/api/order/${orderId}`).then(resp => resp.json()).then(data => {
                if (data.id) {
                    setOrder(data);
                } else {
                    setToast(data[0].detail);
                }
            }, error => setToast(error));
        }
        
        fetch(`/api/catalog?category=${page.split('/')[1]}`).then(resp => resp.json()).then((data) => {
            if (data[0].detail) {
                setToast(data[0].detail);
                setLoading(false);
            } else {
                const images = data.filter(x => x.imageData);
                const items = data.filter(x => !x.imageData);
                items.forEach(item => {
                    if (item.itemData?.imageIds) {
                        item.imageData = images.find(x => x.id === item.itemData?.imageIds![0])?.imageData;
                    }
                })
                setCatalog(items);
                setLoading(false);
            }
        }, categoryError => {
            setToast(categoryError)
            setLoading(false);
        });
    }, [])

    useEffect(() => {
        // populate catalog card inputs with quantity
        const quantities: { id: string, quantity: string }[] = [];
        order?.lineItems?.forEach(item => {
            quantities.push({ id: item.catalogObjectId!, quantity: item.quantity })
        })
        setItemQuantities(quantities);

        setFulfillment(order?.fulfillments && order.fulfillments[0].type ? order.fulfillments[0].type.toLowerCase() : "");
        setFulfillmentSaved(order?.fulfillments != null);

        // populate form fields
        if (order?.fulfillments) {
            if (order.fulfillments[0].type?.toLowerCase() === "shipment") {
                setDisplayName(order?.fulfillments[0].shipmentDetails?.recipient?.displayName ?? "");
                setEmailAddress(order?.fulfillments[0].shipmentDetails?.recipient?.emailAddress ?? "");
                setPhoneNumber(order?.fulfillments[0].shipmentDetails?.recipient?.phoneNumber ?? "");
                setAddress1(order?.fulfillments[0].shipmentDetails?.recipient?.address?.addressLine1 ?? "");
                setAddress2(order?.fulfillments[0].shipmentDetails?.recipient?.address?.addressLine2 ?? "");
                setCity(order?.fulfillments[0].shipmentDetails?.recipient?.address?.sublocality ?? "");
                setState(order?.fulfillments[0].shipmentDetails?.recipient?.address?.locality ?? "");
                setZipcode(order?.fulfillments[0].shipmentDetails?.recipient?.address?.postalCode ?? "");
            } else if (order.fulfillments[0].type?.toLowerCase() === "pickup") {
                setDisplayName(order?.fulfillments[0].pickupDetails?.recipient?.displayName ?? "");
                setEmailAddress(order?.fulfillments[0].pickupDetails?.recipient?.emailAddress ?? "");
                setPhoneNumber(order?.fulfillments[0].pickupDetails?.recipient?.phoneNumber ?? "");
            }
        }
    }, [order])

    function setToast(message: string, success = false) {
        setMessage(message);
        setShowToast(true);
        setToastState(success ? 'border-success' : 'border-danger');
    }

    async function onItemAmountChange(amount: string, itemId: string) {
            const item = [{ lineItemId: itemId, quantity: amount }];
            updateOrderItems(item);
    }

    async function updateOrderItems(items) {
        // set uid if updating item
        items.forEach((item, index) => {
            if (order?.lineItems?.some(x => x.catalogObjectId === item.lineItemId)) {
                const existingItem = order.lineItems.find(x => x.catalogObjectId === item.lineItemId)?.uid;
                items[index] = { uid: existingItem, quantity: item.quantity }
            }
            if (item.quantity === "") items[index].quantity = "0";
        });
        const request = { items, orderId: order?.id, version: order?.version };
        const body = JSON.stringify(request);
        fetch('/api/update-order', {
            method: 'POST',
            headers: {
                "Content-Type": 'application/json'
            },
            body: body
        }).then(resp => resp.json()).then((order) => {
            if (order.id) {
                // set cookie so cart persists
                setOrder(order);
                document.cookie = `orderId=${order.id}`;
            } else {
                setToast(order[0].detail);
            }
        }, error => setToast(error));
    }

    function onAddItemModalClick(item: CatalogObject) {
        setShow(true);
        item.itemData?.variations?.forEach(sub => {
            if (order?.lineItems?.some(x => x.catalogObjectId === sub.id)) {
                const li = document.getElementById(sub.id) as HTMLInputElement;
                if (li) li.value = order.lineItems.find(x => x.catalogObjectId === sub.id)!.quantity;
            }
        });
        setModalItem(item);
    }

    function onCloseModal() {
        setAddedItems([]);
        setShow(false);
    }

    function onVariantAdded(quantity: string, lineItemId: string) {
        const existing = addedItems;
        if (existing.some(x => x.lineItemId === lineItemId)) existing[existing.findIndex(x => x.lineItemId === lineItemId)].quantity = quantity;
        else existing.push({ lineItemId, quantity });
        setAddedItems(existing)
    }

    function onAddItemsClick() {
        if (addedItems) {
            updateOrderItems(addedItems);
            setAddedItems([]);
            onCloseModal();
        }
    }

    function validateFulfillment(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (event.currentTarget.checkValidity() === true) {
            if (fulfillment === "shipment") {
                const formData = new FormData();
                formData.append('address1', address1.replace("&", "%26").replace("#", "%23"));
                formData.append('address2', address2.replace("&", "%26").replace("#", "%23"));
                formData.append('city', city.replace("&", "%26").replace("#", "%23"));
                formData.append('state', state);
                formData.append('zipcode', zipcode.replace("&", "%26").replace("#", "%23"));

                fetch('/api/validate-address',{
                    method: 'POST',
                    body: formData
                }).then(resp => resp.json()).then(data => {
                    if (data.address1 && data.address1.toLowerCase() != address1.toLowerCase()) {
                        setAddress1(data.address1);
                    }
                    if (data.address2 && data.address2.toLowerCase() != address2.toLowerCase()) {
                        setAddress2(data.address2);
                    }
                    if (data.city && data.city.toLowerCase() != city.toLowerCase()) {
                        setCity(data.city);
                    }
                    if (data.state && data.state != state) {
                        setState(data.State);
                    }
                    if (data.zipcode && data.zipcode != zipcode) {
                        setZipcode(data.zipcode);
                    }
                    if (data.returnText || typeof data == 'string') {
                        setUspsResponse(data.returnText ?? data);
                    } else {
                        setUspsResponse("");
                    }

                    if (uspsResponse === "") {
                        addFulfillmentToOrder();
                    }
                }, error => setToast(error));
            } else addFulfillmentToOrder();
        }
        setValidated(true);
    }

    function addFulfillmentToOrder() {
        const request = {
            displayName,
            emailAddress,
            phoneNumber,
            address1,
            address2,
            city,
            state,
            zipcode,
            fulfillment,
            version: order?.version,
            orderId: order?.id,
            fulfillmentUid: order?.fulfillments && order?.fulfillments[0].type?.toLowerCase() != fulfillment ? order.fulfillments[0].uid : null // only set fulfillment to be recreated if type has changed
        }
        fetch('/api/add-fulfillment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(request)
        }).then(resp => resp.json()).then((data) => {
            if (data.id) {
                setOrder(data);
                setActiveKey("2");
                document.cookie = `orderId=${data.id}`;
            } else {
                setToast(data[0].detail);
            }
        });
    }

    function clearCart() {
        const form = document.getElementById("orderForm") as HTMLFormElement;
        form.reset();
        document.cookie = 'orderId=';
        setOrder(undefined);
        setPaymentKey(Math.floor(Math.random() * 1000));
    }

    return (
        <Container fluid className="content">
            {loading ?
                <Container fluid className="page-loader">
                    <Spinner animation="border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                </Container>
            :
                <Row className="p-5">
                    <Col xs="12" lg className="mb-3">
                        <Row>
                            {catalog && catalog.map(item =>
                                <Col xs="12" md="6" lg="4" key={item.id} className="mt-3">
                                    <Card data-bs-theme="light">
                                        <Card.Img
                                            variant="top"
                                            className="img-fluid"
                                            src={item.imageData?.url ?? 'https://acrdphotos.blob.core.windows.net/photos/ACRD%20LOGO%20barrel.png'}
                                            alt={item.itemData?.name ?? 'item'}
                                        />
                                        <Card.Body className="bordered">
                                        </Card.Body>
                                        <Card.Footer>
                                            <Row className="justify-content-between align-items-center">
                                                <Col xs="8">
                                                    <Card.Title>{item.itemData?.name} <span className="text-nowrap">{getItemPrice(item)}</span></Card.Title>
                                                    <Card.Text>{item.itemData?.description}</Card.Text>
                                                </Col>
                                                <Col xs="4" className="d-flex justify-content-end">
                                                    {item?.itemData?.variations &&
                                                        item.itemData.variations.length > 1 ?
                                                        <Button onClick={() => onAddItemModalClick(item)}>+</Button>
                                                        :
                                                        <Form.Control
                                                            type="number"
                                                            min="0"
                                                            name="amount"
                                                            placeholder="#"
                                                            value={itemQuantities.find(x => x.id === item.itemData?.variations![0].id)?.quantity ?? 0}
                                                            onChange={(event) => onItemAmountChange(event.currentTarget.value, item.itemData!.variations![0].id)}
                                                        />
                                                    }
                                                </Col>
                                            </Row>
                                        </Card.Footer>
                                    </Card>
                                </Col>
                            )}
                        </Row>
                    </Col>
                    <Col xs={{ order: 'first' }} lg={{order: 'last', span: '4'}} >
                        <Row>
                            <Col>
                                <Accordion className="position-sticky" data-bs-theme="light" activeKey={activeKey} onSelect={(event) => event && setActiveKey(event.toString())}>
                                    <Accordion.Item eventKey="0">
                                        <Accordion.Header>
                                            Order {Number(order?.totalMoney?.amount) > 0 && <span className="ps-3">${Number(order?.totalMoney?.amount)/100}</span>}
                                        </Accordion.Header>
                                        <Accordion.Body>
                                            <ListGroup>
                                                {order?.lineItems && order.lineItems.map(item =>
                                                    <ListGroup.Item key={item.uid}>
                                                        <Row className="justify-content-between align-items-center">
                                                            <Col className="d-flex align-items-center">
                                                                {item.name} @ ${Number(item.basePriceMoney?.amount) / 100} x
                                                                <Form.Control
                                                                    type="number"
                                                                    className="w-25 mx-2"
                                                                    min="0"
                                                                    onChange={(event) => onItemAmountChange(event.currentTarget.value, item.catalogObjectId!)}
                                                                    value={item.quantity}
                                                                />
                                                                <CloseButton aria-label="Delet item" onClick={() => onItemAmountChange("0", item.catalogObjectId!)} />
                                                            </Col>
                                                            <Col xs="auto">
                                                                ${Number(item.variationTotalPriceMoney?.amount ?? 0) / 100}
                                                            </Col>
                                                        </Row>
                                                    </ListGroup.Item>
                                            )}
                                            </ListGroup>
                                            {Number(order?.totalDiscountMoney?.amount) > 0 &&
                                                order?.discounts?.map(discount =>
                                                    <Row key={discount.uid} className="p-3">
                                                        <Col>
                                                            {discount.name}:
                                                        </Col>
                                                        <Col xs="auto">
                                                            ${Number(discount.appliedMoney?.amount ?? 0) / 100}
                                                        </Col>
                                                    </Row>
                                                )
                                            }
                                            {order?.serviceCharges &&
                                                order?.serviceCharges?.map(charge =>
                                                    <Row key={charge.uid} className="p-3">
                                                        <Col>
                                                            {charge.name}:
                                                        </Col>
                                                        <Col xs="auto">
                                                            ${Number(charge.appliedMoney?.amount ?? 0) / 100}
                                                        </Col>
                                                    </Row>
                                                )
                                            }
                                            <Row className="p-3 fw-bold">
                                                <Col>
                                                    Total:
                                                </Col>
                                                <Col xs="auto">
                                                    ${Number(order?.totalMoney?.amount ?? 0) / 100}
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col className="text-center">
                                                    <Button size="lg" className="px-5" hidden={!order?.lineItems} onClick={() => setActiveKey("1")}>Proceed</Button>
                                                </Col>
                                            </Row>
                                        </Accordion.Body>
                                    </Accordion.Item>
                                    <Accordion.Item eventKey="1">
                                        <Accordion.Header>
                                            Fulfillment {fulfillment && <span className="ps-3">{fulfillment.toUpperCase()}</span>} {order?.serviceCharges && <span className="ps-3">${Number(order?.serviceCharges[0].amountMoney?.amount) / 100 ?? 0}</span>}
                                        </Accordion.Header>
                                        <Accordion.Body>
                                            <Row className="pb-3">
                                                <Col>
                                                    <Form.Select onChange={(e) => setFulfillment(e.currentTarget.value)} disabled={fulfillmentSaved} value={fulfillment}>
                                                        <option value="" >Select option</option>
                                                        <option value="shipment">Ship - $6</option>
                                                        <option value="pickup">Bout day pickup - Free</option>
                                                    </Form.Select>
                                                </Col>
                                            </Row>
                                            <Form id="orderForm" noValidate validated={validated} onSubmit={validateFulfillment}>
                                                {fulfillment &&
                                                    <Row className="pb-3">
                                                        <Form.Group as={Col} className="py-1" xs="12" controlId="displayName">
                                                            <Form.Control
                                                                placeholder="Name"
                                                                type="string"
                                                                aria-label="displayName"
                                                                value={displayName}
                                                                onChange={(e) => setDisplayName(e.currentTarget.value)}
                                                                required
                                                            />
                                                            <Form.Control.Feedback type="invalid">
                                                                Please enter a name.
                                                            </Form.Control.Feedback>
                                                        </Form.Group>
                                                        <Form.Group as={Col} className="py-1" xs="12" controlId="email">
                                                            <Form.Control
                                                                placeholder="Email"
                                                                type="email"
                                                                aria-label="email"
                                                                value={emailAddress}
                                                                onChange={(e) => setEmailAddress(e.currentTarget.value)}
                                                                required
                                                            />
                                                            <Form.Control.Feedback type="invalid">
                                                                Please enter a valid email address.
                                                            </Form.Control.Feedback>
                                                        </Form.Group>
                                                        <Form.Group as={Col} className="py-1" xs="12" controlId="phone">
                                                            <Form.Control
                                                                placeholder="Phone"
                                                                type="phone"
                                                                aria-label="phone"
                                                                value={phoneNumber}
                                                                onChange={(e) => setPhoneNumber(e.currentTarget.value)}
                                                                pattern="/^[0-9()-]+$/"
                                                            />
                                                            <Form.Control.Feedback type="invalid">
                                                                Please enter a valid phone number.
                                                            </Form.Control.Feedback>
                                                        </Form.Group>
                                                    </Row>
                                                }
                                                {fulfillment == "shipment" &&
                                                    <Row className="pb-3">
                                                        <Form.Group as={Col} className="py-1" xs="12" controlId="address1">
                                                            <Form.Control
                                                                placeholder="Address 1"
                                                                required={fulfillment == "shipment"}
                                                                value={address1}
                                                                onChange={(e) => setAddress1(e.currentTarget.value)}
                                                                type="string"
                                                            />
                                                            <Form.Control.Feedback type="invalid">
                                                                Please enter a valid street address.
                                                            </Form.Control.Feedback>
                                                        </Form.Group>
                                                        <Form.Group as={Col} className="py-1" xs="12" controlId="address2">
                                                            <Form.Control
                                                                placeholder="Address 2"
                                                                type="string"
                                                                value={address2}
                                                                onChange={(e) => setAddress2(e.currentTarget.value)}
                                                            />
                                                            <Form.Control.Feedback type="invalid">
                                                                Please enter a valid unit number.
                                                            </Form.Control.Feedback>
                                                        </Form.Group>
                                                        <Form.Group as={Col} className="py-1" xs="12" controlId="city">
                                                            <Form.Control
                                                                placeholder="City"
                                                                required={fulfillment == "shipment"}
                                                                value={city}
                                                                onChange={(e) => setCity(e.currentTarget.value)}
                                                                type="string"
                                                            />
                                                            <Form.Control.Feedback type="invalid">
                                                                Please enter a valid city.
                                                            </Form.Control.Feedback>
                                                        </Form.Group>
                                                        <Form.Group as={Col} className="py-1" xs="6" controlId="state">
                                                            <Form.Select
                                                                placeholder="State"
                                                                required={fulfillment == "shipment"}
                                                                value={state}
                                                                onChange={(e) => setState(e.currentTarget.value)}
                                                            >
                                                            {states.map(state => 
                                                                <option key={state} value={state}>{state}</option>
                                                            )}
                                                            </Form.Select>
                                                            <Form.Control.Feedback type="invalid">
                                                                Please select a state.
                                                            </Form.Control.Feedback>
                                                        </Form.Group>
                                                        <Form.Group as={Col} className="py-1" xs="6" controlId="zipcode">
                                                            <Form.Control
                                                                placeholder="Zipcode"
                                                                type="string"
                                                                value={zipcode}
                                                                onChange={(e) => setZipcode(e.currentTarget.value)}
                                                            />
                                                        </Form.Group>
                                                        <span className="ps-3">Address validation by www.usps.com</span>
                                                    </Row>
                                                }
                                                {uspsResponse && 
                                                    <Row>
                                                        <Col className="m-4 border border-danger rounded pt-3 text-center">
                                                            <p>{uspsResponse}</p>
                                                        </Col>
                                                    </Row>    
                                                }
                                                <Row>
                                                    <Col className="text-center">
                                                        <Button size="lg" className="px-5" hidden={!fulfillment} type="submit">{fulfillment === "shipment" && (!validated || uspsResponse != "") ? 'Verify' : 'Checkout'}</Button>
                                                    </Col>
                                                    {fulfillmentSaved &&
                                                        <Col>
                                                            <Button size="lg" className="px-5 btn-danger" onClick={clearCart}>Restart</Button>
                                                        </Col>
                                                    }
                                                </Row>
                                            </Form>
                                        </Accordion.Body>
                                    </Accordion.Item>
                                    <Accordion.Item eventKey="2">
                                        <Accordion.Header>
                                            Payment
                                        </Accordion.Header>
                                        <Accordion.Body>
                                            <PaymentForm
                                                key={paymentKey}
                                                applicationId="sq0idp-BXIl-QUxiAsKZDxLImqRsg"
                                                cardTokenizeResponseReceived={async (token: TokenResult) => {
                                                    const dataJsonString = JSON.stringify({ sourceId: token.token, order });
                                                    await fetch('api/process-payment', {
                                                        method: 'POST',
                                                        headers: { "Content-Type": "application/json"},
                                                        body: dataJsonString
                                                    }).then(resp => resp.json()).then(data => {
                                                        if (data.errors && data.errors.length > 0) {
                                                            if (data.errors[0].detail) {
                                                                setToast(data.errors[0].detail);
                                                            } else {
                                                                setToast('Payment Failed.');
                                                            }
                                                        } else {
                                                            setToast('Payment Successful!', true);
                                                            clearCart();
                                                        }
                                                    })
                                                }}
                                                /*createPaymentRequest={() => ({
                                                    countryCode: "US",
                                                    currencyCode: "USD",
                                                    total: {
                                                        amount: "1.00",
                                                        label: "Total",
                                                    }
                                                })}*/
                                                locationId="7PS8GHVEB4J0R"
                                            >
                                                {/*<ApplePay />*/}
                                                {/*<GooglePay />*/}
                                                {/*<CashAppPay />*/}
                                                <CreditCard />
                                            </PaymentForm>
                                        </Accordion.Body>
                                    </Accordion.Item>
                                </Accordion>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            }
            <Modal show={show} onHide={onCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>{modalItem?.itemData?.name}</Modal.Title>
                </Modal.Header>
                <ListGroup>
                    {modalItem?.itemData?.variations && modalItem.itemData.variations.map(item =>
                        item.itemVariationData &&
                        <ListGroup.Item key={item.id}>
                            <Row className="justify-content-between align-items-center w-100">
                                <Col>
                                    {item.itemVariationData?.name} - ${Number(item.itemVariationData.priceMoney?.amount) / 100}
                                </Col>
                                    <Col xs="3">
                                        <Form.Control
                                            type="number"
                                            min="0"
                                            placeholder="#"
                                            name={item.id ?? 'no item'}
                                            value={itemQuantities.find(x => x.id === item.id)?.quantity}
                                            onChange={(event) => onVariantAdded(event.currentTarget.value, item.id)}
                                        />
                                </Col>
                            </Row>
                        </ListGroup.Item>
                    )}
                </ListGroup>
                <Modal.Footer>
                    <Button variant="secondary" onClick={onCloseModal}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={onAddItemsClick}>
                        Add Item(s)
                    </Button>
                </Modal.Footer>
            </Modal>

            <ToastContainer
                className="p-5"
                position="bottom-center"
                style={{ zIndex: 1 }}
            >
                <Toast
                    className={`${toastState} px-3 d-flex align-items-center justify-content-between`}
                    show={showToast}
                    delay={10000}
                    autohide
                >
                    <Toast.Body className="border-0">{error}</Toast.Body>
                    <CloseButton onClick={() => setShowToast(false)} />
                </Toast>
            </ToastContainer>
        </Container>
    )
}

export default Shop