// calculator.js - Mudanzas Jao Services

let calculatorData = {}; // Carga desde JSON
let clientInventory = {}; // Guarda { "item_name": { qty: X, factor: Y, category: Z, label: W } }

document.addEventListener('DOMContentLoaded', () => {
  const calculatorApp = document.getElementById('calculator-app');
  const mainForm = document.getElementById('cr-cm-main-form');
  const fitElevatorSelect = document.getElementById('cr-fit-elevator');
  const fitQtyGroup = document.getElementById('cr-fit-qty-group');

  // ==========================================================================
  // 1. CARGAR INVENTARIO DESDE JSON Y RENDERIZAR ESTRUCTURA
  // ==========================================================================
  fetch('js/calculator_items.json')
    .then(response => {
      if (!response.ok) {
        throw new Error("No se pudo cargar el archivo JSON de ítems.");
      }
      return response.json();
    })
    .then(data => {
      calculatorData = data;
      
      // Inicializar el inventario del cliente
      Object.keys(calculatorData).forEach(cat => {
        calculatorData[cat].forEach(item => {
          clientInventory[item.name] = {
            qty: 0,
            factor: item.factor,
            category: cat,
            label: item.label
          };
        });
      });

      // Renderizar los acordeones details por cada categoría
      renderAllCategories();
    })
    .catch(err => {
      console.error("Error al cargar la base del cotizador:", err);
      alert("Error de conexión al cargar la lista de muebles. Por favor recargue el sitio.");
    });

  // ==========================================================================
  // 2. FUNCIÓN PARA RENDERIZAR CATEGORÍAS (DETAILS / SUMMARY)
  // ==========================================================================
  function renderAllCategories() {
    if (!calculatorApp) return;
    calculatorApp.innerHTML = ''; // Limpiar

    Object.keys(calculatorData).forEach((cat, index) => {
      const cleanCatId = cat.replace(/[^a-zA-Z0-9]/g, '_');
      
      // Crear elemento details
      const details = document.createElement('details');
      details.className = 'cr-cm-cat';
      details.id = `cat-details-${cleanCatId}`;
      
      // Por defecto, abrir el primero (Living)
      if (index === 0) {
        details.setAttribute('open', '');
      }

      // Crear el summary con el nombre y totalizador
      const summary = document.createElement('summary');
      summary.innerHTML = `
        <span>${cat}</span>
        <em id="cat-total-${cleanCatId}" class="cr-cm-cat-total">0,00 m³</em>
      `;
      details.appendChild(summary);

      // Crear el contenedor de items (grilla)
      const itemsGrid = document.createElement('div');
      itemsGrid.className = 'cr-cm-items';

      // Añadir cada ítem de esta categoría
      calculatorData[cat].forEach(item => {
        const cleanItemName = item.name.replace(/[^a-zA-Z0-9]/g, '_');
        
        const itemDiv = document.createElement('div');
        itemDiv.className = 'cr-cm-item';
        itemDiv.id = `item-card-${cleanItemName}`;
        itemDiv.innerHTML = `
          <div class="cr-cm-item-name">
            <strong>${item.label}</strong>
            <small>${item.factor.toString().replace('.', ',')} m³ c/u</small>
          </div>
          <div class="cr-cm-qty">
            <button type="button" class="cr-cm-minus" onclick="changeQtyDirect('${item.name}', -1)">-</button>
            <input type="number" id="qty-input-${cleanItemName}" value="0" min="0" readonly>
            <button type="button" class="cr-cm-plus" onclick="changeQtyDirect('${item.name}', 1)">+</button>
          </div>
          <span class="cr-cm-line-total" id="line-total-${cleanItemName}">0,00 m³</span>
        `;
        itemsGrid.appendChild(itemDiv);
      });

      details.appendChild(itemsGrid);
      calculatorApp.appendChild(details);
    });
  }

  // ==========================================================================
  // 3. LOGÍSTICA - CAMBIO DE TIPO DE ELEVADOR MOSTRAR/OCULTAR CANTIDAD
  // ==========================================================================
  if (fitElevatorSelect && fitQtyGroup) {
    fitElevatorSelect.addEventListener('change', (e) => {
      if (e.target.value === 'Sí') {
        fitQtyGroup.style.display = 'block';
        document.getElementById('cr-fit-qty').setAttribute('required', 'required');
      } else {
        fitQtyGroup.style.display = 'none';
        document.getElementById('cr-fit-qty').removeAttribute('required');
      }
    });
  }

  // ==========================================================================
  // 4. FORMULARIO SUBMIT A WHATSAPP
  // ==========================================================================
  if (mainForm) {
    mainForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const totalM3 = calculateTotalM3();
      if (totalM3 <= 0) {
        alert("Por favor, seleccione al menos un artículo en el Inventario (sección 3) antes de cotizar.");
        return;
      }

      // Obtener datos
      const name = document.getElementById('cr-name').value.trim();
      const phone = document.getElementById('cr-phone').value.trim();
      const email = document.getElementById('cr-email').value.trim();
      const date = document.getElementById('cr-date').value;
      
      const origin = document.getElementById('cr-origin').value.trim();
      const destination = document.getElementById('cr-destination').value.trim();
      const floor = document.getElementById('cr-floor').value.trim();
      const access = document.getElementById('cr-access').value;
      const fitElevator = document.getElementById('cr-fit-elevator').value;
      const fitQty = document.getElementById('cr-fit-qty').value || '0';
      
      const comments = document.getElementById('cr-comments').value.trim() || 'Ninguno';

      // Agrupar items seleccionados por categoría
      let inventoryDetailsText = '';
      Object.keys(calculatorData).forEach(cat => {
        let catText = '';
        Object.keys(clientInventory).forEach(itemName => {
          const itemObj = clientInventory[itemName];
          if (itemObj.category === cat && itemObj.qty > 0) {
            catText += `  - ${itemObj.qty}x ${itemObj.label}\n`;
          }
        });
        if (catText) {
          inventoryDetailsText += `*${cat.toUpperCase()}:*\n${catText}`;
        }
      });

      // Crear mensaje de WhatsApp
      let waText = `*Cotización Mudanzas Jao Services* 🚛\n\n`;
      waText += `*📐 VOLUMEN CALCULADO:* ${totalM3.toFixed(2).replace('.', ',')} m³\n\n`;
      waText += `*📦 INVENTARIO COMPLETO:*\n${inventoryDetailsText}\n`;
      waText += `*📍 RUTA Y ACCESOS:*\n`;
      waText += `- Origen: ${origin}\n`;
      waText += `- Destino: ${destination}\n`;
      waText += `- ¿Piso / Departamento?: ${floor}\n`;
      waText += `- Acceso por: ${access}\n`;
      waText += `- ¿Muebles que no caben en el ascensor?: ${fitElevator}${fitElevator === 'Sí' ? ` (${fitQty} mueble(s))` : ''}\n`;
      waText += `- Detalles de acceso: ${comments}\n\n`;
      waText += `*👤 CLIENTE:*\n`;
      waText += `- Nombre: ${name}\n`;
      waText += `- Teléfono: ${phone}\n`;
      waText += `- Email: ${email}\n`;
      waText += `- Fecha estimada: ${date}\n\n`;
      waText += `Quedo atento a su confirmación y propuesta comercial. ¡Gracias!`;

      const waNumber = "56966466542";
      const url = `https://wa.me/${waNumber}?text=${encodeURIComponent(waText)}`;
      
      window.open(url, '_blank');
    });
  }
});

// ==========================================================================
// 5. FUNCIONES GLOBALES PARA CONTROLADORES DE CANTIDAD (+) Y (-)
// ==========================================================================
function changeQtyDirect(itemName, delta) {
  if (!clientInventory[itemName]) return;
  
  const itemObj = clientInventory[itemName];
  const oldQty = itemObj.qty;
  const newQty = Math.max(0, oldQty + delta);
  
  itemObj.qty = newQty;

  const cleanItemName = itemName.replace(/[^a-zA-Z0-9]/g, '_');

  // Actualizar el valor en el input
  const inputEl = document.getElementById(`qty-input-${cleanItemName}`);
  if (inputEl) {
    inputEl.value = newQty;
  }

  // Actualizar el subtotal de la línea del mueble
  const lineTotalEl = document.getElementById(`line-total-${cleanItemName}`);
  if (lineTotalEl) {
    lineTotalEl.textContent = `${(newQty * itemObj.factor).toFixed(2).replace('.', ',')} m³`;
  }

  // Toggle .hasqty class en la tarjeta del mueble
  const cardEl = document.getElementById(`item-card-${cleanItemName}`);
  if (cardEl) {
    if (newQty > 0) {
      cardEl.classList.add('hasqty');
    } else {
      cardEl.classList.remove('hasqty');
    }
  }

  // Recalcular y actualizar subtotal de la categoría (en el acordeón details)
  updateCategoryTotal(itemObj.category);

  // Recalcular y actualizar total global
  const totalGlobalM3 = calculateTotalM3();
  const totalM3El = document.getElementById('cr-total-m3');
  if (totalM3El) {
    totalM3El.textContent = `${totalGlobalM3.toFixed(2).replace('.', ',')} m³`;
  }
}

function updateCategoryTotal(categoryName) {
  let catTotal = 0;
  Object.keys(clientInventory).forEach(key => {
    const itemObj = clientInventory[key];
    if (itemObj.category === categoryName) {
      catTotal += itemObj.qty * itemObj.factor;
    }
  });

  const cleanCatId = categoryName.replace(/[^a-zA-Z0-9]/g, '_');
  const catTotalEl = document.getElementById(`cat-total-${cleanCatId}`);
  if (catTotalEl) {
    catTotalEl.textContent = `${catTotal.toFixed(2).replace('.', ',')} m³`;
  }
}

function calculateTotalM3() {
  let total = 0;
  Object.keys(clientInventory).forEach(key => {
    const itemObj = clientInventory[key];
    total += itemObj.qty * itemObj.factor;
  });
  return total;
}
