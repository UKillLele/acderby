import { TokenResult } from "@square/web-payments-sdk-types";
import { useEffect, useState } from "react";
import { Accordion, Button, Card, CloseButton, Col, Container, Form, ListGroup, Modal, Row, Spinner } from "react-bootstrap";
import { PaymentForm, CreditCard } from "react-square-web-payments-sdk";
import { CatalogObject, Client, Order, Environment } from "square";

const client = new Client({
    accessToken: import.meta.env.VITE_SQUARE_ACCESS_TOKEN,
    environment: Environment.Sandbox
});

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
    
    useEffect(() => {
        const page = window.location.pathname;
        const orderId = document.cookie.split('; ').find(x => x.startsWith('orderId'))?.split('=')[1];
        if (orderId) {
            fetch(`/api/order/${orderId}`).then(resp => resp.json()).then(data => {
                setOrder(data);
            }, error => console.log(error));
        }
        client.catalogApi.listCatalog(undefined, "CATEGORY").then(data => {
            const { objects } = data.result;
            if (objects) {
                client.catalogApi.searchCatalogObjects({
                    objectTypes: ['ITEM'],
                    query: {
                        exactQuery: {
                            attributeName: 'category_id',
                            attributeValue: objects.find(x => x.categoryData?.name === (page.includes("tickets") ? "Presale" : "Merchandise"))!.id
                        }
                    }
                }).then(catalogData => {
                    const catalogObjects = catalogData.result.objects;
                    if (catalogObjects) {
                        client.catalogApi.listCatalog(undefined, "IMAGE").then(imageData => {
                            const { objects: imageObjects } = imageData.result;
                            catalogObjects.forEach(item => {
                                if (item.itemData?.imageIds) {
                                    item.imageData = imageObjects?.find(x => x.id === item.itemData?.imageIds![0])?.imageData;
                                }
                            })
                            setCatalog(catalogObjects);
                            setLoading(false);
                        }, imageError => {
                            console.log(imageError)
                            setLoading(false);
                        })
                    }
                }, catalogError => {
                    console.log(catalogError)
                    setLoading(false);
                });
            }
        }, categoryError => {
            console.log(categoryError)
            setLoading(false);
        });
    }, [])

    useEffect(() => {
        // populate card inputs with quantity
        const quantities: { id: string, quantity: string }[] = [];
        order?.lineItems?.forEach(item => {
            quantities.push({ id: item.catalogObjectId!, quantity: item.quantity })
        })
        setItemQuantities(quantities);
    }, [order])

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
        }).then(resp => resp.json()).then((order: Order) => {
            if (order) {
                // set cookie so cart persists
                setOrder(order);
                document.cookie = `orderId=${order.id}`;
            }
        }, error => console.log(error));
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

    function validateFulfillment() {
        // validate
        // update order
        // add $6 fee for shipments
        // setActiveKey("2")
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
                    <Col>
                        <Row>
                            {catalog && catalog.map(item =>
                                <Col xs md="6" lg="4" key={item.id} className="mt-3">
                                    <Card>
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
                    <Col xs lg="4">
                        <Row>
                            <Col>
                                <Accordion activeKey={activeKey} onSelect={(event) => setActiveKey(event!.toString())}>
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
                                                                ${Number(item.variationTotalPriceMoney?.amount) / 100}
                                                            </Col>
                                                        </Row>
                                                    </ListGroup.Item>
                                            )}
                                            </ListGroup>
                                            {Number(order?.totalDiscountMoney?.amount) > 0 &&
                                                order?.discounts?.map(discount =>
                                                    <Row className="p-3">
                                                        <Col>
                                                            {discount.name}:
                                                        </Col>
                                                        <Col xs="auto">
                                                            ${Number(discount.appliedMoney?.amount) / 100}
                                                        </Col>
                                                    </Row>
                                                )
                                            }
                                            <Row className="p-3 fw-bold">
                                                <Col>
                                                    Total:
                                                </Col>
                                                <Col xs="auto">
                                                    ${Number(order?.totalMoney?.amount) / 100}
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
                                            Fulfillment {fulfillment && <span className="ps-3">{fulfillment.toUpperCase()}</span>}
                                        </Accordion.Header>
                                        <Accordion.Body>
                                            <Row className="pb-3">
                                                <Col>
                                                    <Form.Select onChange={(event) => setFulfillment(event.currentTarget.value)}>
                                                        <option value="">Select option</option>
                                                        <option value="shipment">Ship</option>
                                                        <option value="pickup">Bout day pickup</option>
                                                    </Form.Select>
                                                </Col>
                                            </Row>
                                            {fulfillment &&
                                                <Row className="pb-3">
                                                    <Col>
                                                        <Form.Control placeholder="Name" type="string" required />
                                                        <Form.Control placeholder="Email" type="email" required />
                                                        <Form.Control placeholder="Phone" type="phone" />
                                                    </Col>
                                                </Row>
                                            }
                                            {fulfillment == "shipment" &&
                                                <Row className="pb-3">
                                                    <Col>
                                                        <Form.Control placeholder="Address 1" type="string" />
                                                        <Form.Control placeholder="Address 2" type="string" />
                                                        <Form.Control placeholder="City" type="string" />
                                                        <Form.Control placeholder="State" type="string" />
                                                        <Form.Control placeholder="Zipcode" type="string" />
                                                    </Col>
                                                </Row>
                                            }
                                            <Row>
                                                <Col className="text-center">
                                                    <Button size="lg" className="px-5" hidden={!fulfillment} onClick={validateFulfillment}>Checkout</Button>
                                                </Col>
                                            </Row>
                                        </Accordion.Body>
                                    </Accordion.Item>
                                    <Accordion.Item eventKey="2">
                                        <Accordion.Header>
                                            Payment
                                        </Accordion.Header>
                                        <Accordion.Body>
                                            <PaymentForm
                                                applicationId={import.meta.env.VITE_SQUARE_APPLICATION_ID}
                                                cardTokenizeResponseReceived={async (token: TokenResult) => {
                                                    const dataJsonString = JSON.stringify({ sourceId: token.token });
                                                    await fetch('api/process-payment', {
                                                        method: 'POST',
                                                        body: dataJsonString
                                                    }).then(resp => resp.json()).then(data => {
                                                        if (data.errors && data.errors.length > 0) {
                                                            if (data.errors[0].detail) {
                                                                //window.showError(data.errors[0].detail);
                                                                console.log(data.errors[0].detail);
                                                            } else {
                                                                //window.showError('Payment Failed.');
                                                                console.log('Payment Failed.');
                                                            }
                                                        } else {
                                                            //window.showSuccess('Payment Successful!');
                                                            console.log('Payment Successful!');
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
                                                locationId={import.meta.env.VITE_SQUARE_LOCATION_ID}
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
        </Container>
    )
}

export default Shop