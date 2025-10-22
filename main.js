const TOTAL_SEATS = 20;

const seatsGrid = document.getElementById('seatsGrid');
const modalOverlay = document.getElementById('modalOverlay');
const modalClose = document.getElementById('modalClose');
const cancelBooking = document.getElementById('cancelBooking');
const confirmBooking = document.getElementById('confirmBooking');

const inputName = document.getElementById('inputName');
const inputPhone = document.getElementById('inputPhone');
const inputEmail = document.getElementById('inputEmail');

let currentSeat = null;

// ✅ تحميل بيانات المقاعد من Firebase
let seats = Array(TOTAL_SEATS).fill(null); // البداية فارغة

function loadSeatsFromFirebase() {
  database.ref('seats').once('value')
    .then(snapshot => {
      const data = snapshot.val();
      if (data) seats = data;
      renderSeats();
    })
    .catch(err => console.error('خطأ في تحميل المقاعد:', err));
}

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

// ✅ تأكيد الحجز وحفظه في Firebase
confirmBooking.addEventListener('click', () => {
  const name = inputName.value.trim();
  const phone = inputPhone.value.trim();
  const email = inputEmail.value.trim();

  if (!name || !phone || !email) {
    alert('يرجى تعبئة جميع الحقول المطلوبة');
    return;
  }

  seats[currentSeat] = { name, phone, email, date: new Date().toISOString() };

  database.ref('seats/' + currentSeat).set(seats[currentSeat])
    .then(() => {
      modalOverlay.classList.add('hidden');
      renderSeats();
      alert(`✅ تم حجز المقعد رقم ${parseInt(currentSeat) + 1} بنجاح`);
    })
    .catch(err => {
      console.error(err);
      alert('حدث خطأ أثناء الحجز، حاول مرة أخرى');
    });
});

// ✅ إغلاق المودال
modalClose.addEventListener('click', () => modalOverlay.classList.add('hidden'));
cancelBooking.addEventListener('click', () => modalOverlay.classList.add('hidden'));

// ✅ تحميل وعرض المقاعد عند فتح الصفحة
loadSeatsFromFirebase();
