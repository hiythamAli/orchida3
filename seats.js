const TOTAL_SEATS = 20;

// تحميل بيانات المقاعد من التخزين المحلي
let seats = JSON.parse(localStorage.getItem('seatsData')) || Array(TOTAL_SEATS).fill(null);

const seatsGrid = document.getElementById('seatsGrid');
const modalOverlay = document.getElementById('modalOverlay');
const modalClose = document.getElementById('modalClose');
const cancelBooking = document.getElementById('cancelBooking');
const confirmBooking = document.getElementById('confirmBooking');

const inputName = document.getElementById('inputName');
const inputPhone = document.getElementById('inputPhone');
const inputEmail = document.getElementById('inputEmail');

let currentSeat = null;

// ✅ عرض المقاعد
function renderSeats() {
  seatsGrid.innerHTML = '';
  seats.forEach((seat, index) => {
    const card = document.createElement('div');
    card.className = 'seat-card';
    card.innerHTML = `
      <h3>مقعد ${index + 1}</h3>
      <p>الحالة: <span class="${seat ? 'reserved' : 'available'}">${seat ? 'محجوز' : 'متاح'}</span></p>
      <button class="btn primary book-btn" data-id="${index}" ${seat ? 'disabled' : ''}>
        ${seat ? 'محجوز' : 'حجز'}
      </button>
    `;
    seatsGrid.appendChild(card);
  });

  // إضافة حدث لكل زر حجز
  document.querySelectorAll('.book-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      currentSeat = btn.dataset.id;
      modalOverlay.classList.remove('hidden');
      inputName.value = '';
      inputPhone.value = '';
      inputEmail.value = '';
    });
  });
}

// ✅ تأكيد الحجز
confirmBooking.addEventListener('click', () => {
  const name = inputName.value.trim();
  const phone = inputPhone.value.trim();
  const email = inputEmail.value.trim();

  if (!name || !phone || !email) {
    alert('يرجى تعبئة جميع الحقول المطلوبة');
    return;
  }

  // تحديث التخزين المحلي
  seats[currentSeat] = { name, phone, email, date: new Date().toISOString() };
  localStorage.setItem('seatsData', JSON.stringify(seats));

  // ✅ حفظ في Firebase Realtime Database
  if (typeof firebase !== 'undefined') {
    firebase.database().ref('seats/' + currentSeat).set({
      name,
      phone,
      email,
      date: new Date().toISOString()
    });
  }

  modalOverlay.classList.add('hidden');
  renderSeats();

  alert(`✅ تم حجز المقعد رقم ${parseInt(currentSeat) + 1} بنجاح`);
});

// ✅ إغلاق المودال
modalClose.addEventListener('click', () => modalOverlay.classList.add('hidden'));
cancelBooking.addEventListener('click', () => modalOverlay.classList.add('hidden'));

// ✅ تحميل بيانات المقاعد من Firebase عند فتح الصفحة
window.addEventListener('load', () => {
  if (typeof firebase !== 'undefined') {
    firebase.database().ref('seats').once('value', snapshot => {
      const data = snapshot.val();
      if (data) {
        seats = Array(TOTAL_SEATS).fill(null); // إعادة تهيئة
        Object.keys(data).forEach(key => {
          seats[key] = data[key];
        });
        renderSeats();
      }
    });
  } else {
    // إذا Firebase غير موجود، يعرض البيانات من التخزين المحلي فقط
    renderSeats();
  }
});
confirmBooking.addEventListener('click', () => {
  const name = inputName.value.trim();
  const phone = inputPhone.value.trim();
  const email = inputEmail.value.trim();

  if(!name || !phone || !email) {
    alert('يرجى تعبئة جميع الحقول المطلوبة');
    return;
  }

  // إعداد بيانات المقعد
  const seatData = { name, phone, email, date: new Date().toISOString() };

  // تخزين في LocalStorage (اختياري)
  seats[currentSeat] = seatData;
  localStorage.setItem('seatsData', JSON.stringify(seats));

  // تخزين في Firebase
  database.ref('seats/' + currentSeat).set(seatData)
    .then(() => {
      modalOverlay.classList.add('hidden');
      renderSeats();
      alert(`✅ تم حجز المقعد رقم ${parseInt(currentSeat) + 1} بنجاح`);
    })
    .catch((error) => {
      alert('حدث خطأ أثناء الحفظ في قاعدة البيانات: ' + error.message);
    });
});

// ✅ عرض المقاعد عند تحميل الصفحة (في حال Firebase غير جاهز)
renderSeats();
