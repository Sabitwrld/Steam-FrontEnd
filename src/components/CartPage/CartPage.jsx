import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect, Link, useHistory } from "react-router-dom";
import { deleteAllCartItems, fetchCartItems } from "../../store/cartItems";
import apiFetch from "../../store/api"; // Merkezi API fonksiyonumuzu import ediyoruz
import StoreNavbar from "../StoreHomePage/StoreNavbar/StoreNavbar";
import CartItem from "./CartItem";
import "./CartPage.css";

export default function CartPage() {
  document.title = "Shopping Cart";
  const dispatch = useDispatch();
  const history = useHistory();

  const currentUser = useSelector(state => state.session.user);
  const cartItemsArray = useSelector(state => Object.values(state.cartItems));
  const games = useSelector(state => state.games); // Oyun detayları için

  // Toplam fiyatı backend'den almak için bir state
  const [totalPrice, setTotalPrice] = useState("0.00");

  useEffect(() => {
    if (currentUser) {
      // Sepet verilerini backend'den çekiyoruz
      dispatch(fetchCartItems()).then(cartData => {
         // fetchCartItems thunk'ının sepetin tamamını döndürdüğünü varsayıyoruz
         if (cartData && cartData.totalPrice) {
            setTotalPrice(cartData.totalPrice.toFixed(2));
         }
      });
    }
  }, [dispatch, currentUser]);

  // Eğer kullanıcı giriş yapmamışsa, login sayfasına yönlendir
  if (!currentUser) {
    return <Redirect to="/login" />;
  }

  // Satın alma işlemini backend akışına uygun hale getiriyoruz
  const handlePurchase = async () => {
    if (cartItemsArray.length === 0) return;

    try {
      // 1. Adım: Sepetten bir sipariş oluştur. Backend sepeti otomatik olarak temizleyecek.
      console.log("Creating order from cart...");
      const order = await apiFetch('/api/order', { method: 'POST' });

      // 2. Adım: Oluşturulan sipariş için ödeme yap.
      console.log(`Processing payment for order ID: ${order.id}...`);
      await apiFetch('/api/payment', {
        method: 'POST',
        body: JSON.stringify({ orderId: order.id, method: 'Card' }) // Ödeme metodu placeholder
      });

      // 3. Adım: Başarılı olursa kullanıcıya bilgi ver ve kütüphanesine yönlendir.
      alert('Purchase successful! Your games have been added to your library.');
      history.push(`/users/${currentUser.username}/games`);

    } catch (error) {
      console.error("Purchase failed:", error);
      alert(`An error occurred during purchase: ${error.message || 'Please try again.'}`);
    }
  };

  const handleRemoveAll = () => {
    if (window.confirm('Are you sure you want to remove all items from your cart?')) {
      dispatch(deleteAllCartItems());
    }
  };

  const cartItemComponents = cartItemsArray.map(cartItem => {
    const game = games[cartItem.applicationId];
    // Oyun bilgisi henüz yüklenmemişse, o ürünü render etme
    return game ? <CartItem cartItem={cartItem} game={game} key={cartItem.id} /> : null;
  });

  return (
    <div className="cart-page">
      <div className="cart-page-glow-background" />
      <StoreNavbar />
      <header className="cart-page-title-wrapper">
        <span><Link to="/store">All Products</Link> {'>'} Your Shopping Cart</span>
        <h1>Your Shopping Cart</h1>
      </header>
      <section className="cart-page-main-column-wrapper">
        <div className="cart-page-main-left">
          {cartItemsArray.length > 0 ? cartItemComponents : <h2>Your cart is empty.</h2>}
          <div className="checkout-wrapper">
            <div className="estimated-total-wrapper">
              <span><h1>Estimated total</h1><sup> 1</sup></span>
              {/* Toplam fiyatı state'den alıyoruz */}
              <h1>${totalPrice}</h1>
            </div>
            <div className="checkout-buttons continue-shopping">
              <button 
                className="orange-button" 
                onClick={handlePurchase} 
                disabled={cartItemsArray.length === 0}
              >
                Purchase
              </button>
            </div>
          </div>
          <div className="sales-tax-disclaimer-wrapper checkout-page-body-p">
            <sup>1</sup><p>Sales tax will be calculated during checkout where applicable.</p>
          </div>
          <div className="continue-shopping-wrapper">
            <Link to="/store" className="light-blue-button continue-shopping">Continue Shopping</Link>
            <span onClick={handleRemoveAll} className="cart-remove">Remove all items</span>
          </div>
        </div>
      </section>
    </div>
  );
}