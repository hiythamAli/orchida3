// Dropdown

// عند تحميل الصفحة
window.addEventListener('load', () => {
  database.ref('seats').once('value', snapshot => {
    const data = snapshot.val();
    if(data){
      seats = Array(TOTAL_SEATS).fill(null); // إعادة تهيئة
      Object.keys(data).forEach(key => {
        seats[key] = data[key];
      });
      renderSeats();
    }
  });
});

document.addEventListener('DOMContentLoaded', () => {
  const dropdown = document.querySelector('.dropdown');
  const dropbtn = dropdown.querySelector('.dropbtn');

  dropbtn.addEventListener('click', (e) => {
    e.preventDefault();
    dropdown.classList.toggle('active');
  });

  document.addEventListener('click', (e) => {
    if (!dropdown.contains(e.target)) {
      dropdown.classList.remove('active');
    }
  });
});

// Modal الحجز (كمثال)
const modalOverlay = document.getElementById('modalOverlay');
const modalClose = document.getElementById('modalClose');
const cancelBooking = document.getElementById('cancelBooking');
const confirmBooking = document.getElementById('confirmBooking');

modalClose.addEventListener('click', () => modalOverlay.classList.add('hidden'));
cancelBooking.addEventListener('click', () => modalOverlay.classList.add('hidden'));

// هنا ممكن تضيف كود حجز المقاعد إذا حابب (مثل السابق)
// Dropdown فقط
document.addEventListener('DOMContentLoaded', () => {
  const dropdown = document.querySelector('.dropdown');
  const dropbtn = dropdown.querySelector('.dropbtn');

  dropbtn.addEventListener('click', (e) => {
    e.preventDefault();
    dropdown.classList.toggle('active');
  });

  document.addEventListener('click', (e) => {
    if (!dropdown.contains(e.target)) {
      dropdown.classList.remove('active');
    }
  });
});
