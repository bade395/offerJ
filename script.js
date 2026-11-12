document.addEventListener('DOMContentLoaded', () => {

    const defaultItems = [
        { carType: '', quantity: '', duration: '', typeOfRent: 'Yearly / سنوي', rentalPrice: '', extraKmPrice: '', isCustom: false }
    ];

    const CAR_OPTIONS = [
        "HYUNDAI GRAND i10", "SUZUKI DZIRE", "HYUNDAI ACCENT", "TOYOTA YARIS", "NISSAN SUNNY", "KIA PEGAS", "HYUNDAI ELANTRA",
        "TOYOTA COROLLA", "KIA CERATO", "TOYOTA CAMRY", "HYUNDAI SONATA", "MAZDA 6", "KIA K5", "HYUNDAI TUCSON 4X2",
        "HYUNDAI KONA 4X2", "HYUNDAI CRETA 4X2", "GEELY COOLRAY GS BASIC 4X2", "TOYOTA RAIZE 4X2", "HYUNDAI TUCSON 4X4",
        "FORD TAURUS", "KIA CARNIVAL", "HYUNDAI STARIA STANDARD 9 SEATER", "HYUNDAI STARIA 7 SEATER LUXURY", "CHEVROLET SUBURBAN 4X2",
        "TOYOTA FORTUNER GX2 4X4 (4CYL)", "NISSAN X-TRAIL", "GEELY TUGELLA FULL OPTION", "TOYOTA PRADO TX (4 CYL)", "FORD EXPLORER",
        "CHEVROLET TAHOE 4X4", "FORD BRONCO", "TOYOTA PRADO 6 CYL", "TOYOTA LANDCRUISER GXR", "NISSAN PATROL 6CYL",
        "RANGE ROVER EVOQUE R- DDYNAMIC S", "AUDI Q5", "MERCEDES GLC C200", "BMW X4", "AUDI Q8", "MERCEDES A CLASS", "BMX X2",
        "MERCEDES C CLASS", "GENESIS G80", "MERCEDES CLA 200", "AUDI Q3", "MERCEDES E CLASS", "BMW 5 SERIES", "MERCEDES VIANO",
        "BMW 730", "AUDI A8", "MERCEDES S450", "ISUZU DMAX DOUBLE CAB 4X2 MANUAL 4 CYLINDER", "ISUZU DMAX DOUBLE CAB 4X4 MANUAL 4 CYLINDER",
        "ISUZU LS DOUBLE CAB 4X2 MANUAL 6 CYLINDER", "ISUZU LS DOUBLE CAB 4X4 MANUAL 6 CYLINDER", "ISUZU LS DOUBLE CAB 4X4 AUTOMATIC 6 CYLINDER",
        "TOYOTA HIACE PETROL ( MEDIUM )", "NISSAN URVAN PETROL ( MEDIUM )", "TOYOTA HIACE DIESEL ( MEDIUM )", "NISSAN URVAN DIESEL ( MEDIUM )",
        "TOYOTA HIACE PETROL ( REFER )", "NISSAN URVAN PETROL ( REFER )", "TOYOTA HIACE DIESEL ( REFER )", "NISSAN URVAN DIESEL ( REFER )",
        "Kia Pegas", "Suzuki Dzire or Similar", "Hyundai Accent, or Similar", "Hyundai Creta", "Toyota Corolla", "Changan CS35, or Similar",
        "Mazda 6", "Hyundai Sonata", "Toyota Camry or similar", "Ford Taurus, or Similar", "BMW 3 Series or Similar", "Jetour X70 2WD",
        "Haval H6", "Hyundai Tucson 4WD", "Toyota RAV4 4WD", "Kia Sportage 4WD, or Similar", "Toyota Fortuner 4WD", "Isuzu MUX 4WD",
        "Toyota Highlander AWD HEV, or Similar", "Toyota Prado, or Similar", "CHEVROLET Tahoe", "GMC Yukon", "Nissan Patrol V6",
        "Ford Bronco, or Similar", "Yukon XL ", "CHEVROLET Suburban", "Toyota Land Cruiser, or Similar", "Lexus LX600, or Similar",
        "BMW X1", "BMW X2", "BMW 420i or Similar", "BMW 5-series or similar", "BMW 7-series or similar", "Mercedes-Benz S-class or similar",
        "Hyundai Staria minivan, or Similar", "Mercedes-Benz Vetto ", "Hyundai Staria VIP, or Similar", "Toyota Hilux (Single Cabin)",
        "Isuzu D-Max (Single Cabin)", "Toyota Hilux (Double Cabin)", "Isuzu D-Max (Double Cabin)", "Changan Hunter 4WD (Double Cabin)",
        "Hilux Super GLX", "Ford-F150", "CHEVROLET Silverado 1502"
    ];

    let items = JSON.parse(JSON.stringify(defaultItems));
    let quoteReadOnly = false;

    const itemsTbody = document.getElementById('items-tbody');
    const itemsTbody2 = document.getElementById('items-tbody-2');
    const overflowPage = document.getElementById('page-overflow-items');
    
    const tableSection1 = document.getElementById('table-section-1');
    const tableSection2 = document.getElementById('table-section-2');
    const summaryAndStampBlock = document.getElementById('quote-summary-and-stamp');

    const sumNetElem = document.getElementById('sum-net');
    const sumVatElem = document.getElementById('sum-vat');
    const sumGrandElem = document.getElementById('sum-grand');
    const quoteDateInput = document.getElementById('quote-date');
    const quoteRefInput = document.getElementById('quote-ref');

    const btnAddItem = document.getElementById('btn-add-item');
    const btnGenRef = document.getElementById('btn-gen-ref');
    const btnReset = document.getElementById('btn-reset');
    const btnPrint = document.getElementById('btn-print');
    const btnExportPdfMobile = document.getElementById('btn-export-pdf-mobile');
    const btnExportPdfDesktop = document.getElementById('btn-export-pdf-desktop');

    const MAX_PAGE1_CAPACITY = 20;

    function formatMoney(amount, decimals = 2) {
        if (isNaN(amount) || amount === 0) return '0.00';
        return amount.toLocaleString('en-US', {
            minimumFractionDigits: decimals,
            maximumFractionDigits: 2
        });
    }

    function parseNum(str, isDecimal = false) {
        if (!str) return 0;
        const clean = String(str).replace(/[^\d.]/g, '');
        const n = isDecimal ? parseFloat(clean) : parseInt(clean);
        return isNaN(n) ? 0 : n;
    }

    function generateAutoMeta() {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const dateStr = `${year}/${month}/${day} م`;
        const yy = String(year).slice(-2);
        const refSeq = Math.floor(100 + Math.random() * 900);
        const refStr = `${day}${month}${yy} PE${refSeq}`;
        quoteDateInput.value = dateStr;
        quoteRefInput.value = refStr;
    }

    function updateTotals() {
        let totalNet = 0, totalVat = 0, totalGrand = 0;
        const page1Count = Math.min(items.length, MAX_PAGE1_CAPACITY);

        items.forEach((item, index) => {
            const qty = parseNum(item.quantity, false);
            const price = parseNum(item.rentalPrice, true);
            
            const lineTotal = qty * price;
            const lineVat = lineTotal * 0.15;
            const lineGrand = lineTotal + lineVat;

            totalNet += lineTotal;
            totalVat += lineVat;
            totalGrand += lineGrand;

            let row = itemsTbody.rows[index];
            if (!row && itemsTbody2) {
                row = itemsTbody2.rows[index - page1Count];
            }

            if (row) {
                row.cells[3].textContent = formatMoney(lineTotal, 2);
                row.cells[4].textContent = formatMoney(lineVat, 2);
                row.cells[5].textContent = formatMoney(lineGrand, 2);
            }
        });

        sumNetElem.textContent = formatMoney(totalNet, 2);
        sumVatElem.textContent = formatMoney(totalVat, 2);
        sumGrandElem.textContent = formatMoney(totalGrand, 2);
    }

    function buildRowHtml(item, index) {
        const qty = parseNum(item.quantity, false);
        const price = parseNum(item.rentalPrice, true);
        const lineTotal = qty * price;
        const lineVat = lineTotal * 0.15;
        const lineGrand = lineTotal + lineVat;

        const carFieldHtml = `
            <textarea rows="1" class="editable-field table-input statement-input" data-index="${index}" data-key="carType" placeholder="اكتب البيان"></textarea>
        `;

        return `
            <td>${carFieldHtml}</td>
            <td>
                <input type="text" inputmode="numeric" class="editable-field table-input" value="${item.quantity}" data-index="${index}" data-key="quantity" placeholder="0">
            </td>
            
            
            <td>
                <input type="text" inputmode="decimal" class="editable-field table-input price-input" value="${item.rentalPrice}" data-index="${index}" data-key="rentalPrice" placeholder="0.00">
            </td>
            <td class="total-cell">${lineTotal > 0 ? formatMoney(lineTotal, 2) : '0.00'}</td>
            <td class="total-cell">${lineVat > 0 ? formatMoney(lineVat, 2) : '0.00'}</td>
            <td class="total-cell">${lineGrand > 0 ? formatMoney(lineGrand, 2) : '0.00'}</td>
            
            <td class="no-print row-action-col">
                ${items.length > 1 ? `<button type="button" class="btn-del-row" data-index="${index}">×</button>` : ''}
            </td>
        `;
    }

    function resizeStatementInput(field) {
        if (!field) return;
        field.style.height = 'auto';
        field.style.minHeight = '0';
        field.style.overflow = 'hidden';
        field.style.whiteSpace = 'pre-wrap';
        field.style.overflowWrap = 'anywhere';
        const styles = window.getComputedStyle(field);
        const lineHeight = parseFloat(styles.lineHeight) || 18;
        field.style.height = Math.max(lineHeight + 6, field.scrollHeight + 2) + 'px';
        const row = field.closest('tr');
        if (row) {
            row.style.height = 'auto';
            row.style.minHeight = '0';
        }
    }

    function renderItems() {
        itemsTbody.innerHTML = '';
        if (itemsTbody2) itemsTbody2.innerHTML = '';

        // Keep all quotation items together on page one; page two is never used for output.
        const page1Cutoff = items.length;
        items.forEach((item, idx) => {
            const tr = document.createElement('tr');
            tr.setAttribute('data-row', idx);
            tr.innerHTML = buildRowHtml(item, idx);
            itemsTbody.appendChild(tr);
        });
        if (overflowPage) overflowPage.style.display = 'none';
        tableSection1.after(summaryAndStampBlock);

        const addRowTarget = itemsTbody;
        const addRow = document.createElement('tr');
        addRow.className = 'add-item-table-row no-print';
        addRow.innerHTML = '<td colspan="7"><button type="button" class="btn-add-inline" data-add-row>＋ إضافة بند</button></td>';
        addRowTarget.appendChild(addRow);

        document.querySelectorAll('.statement-input').forEach(field => {
            const idx = Number(field.getAttribute('data-index'));
            field.value = String(items[idx]?.carType ?? '');
            resizeStatementInput(field);
        });
        updateTotals();
        attachInputListeners();
    }

    function attachInputListeners() {
        document.querySelectorAll('[data-index]').forEach(el => {
            const isSelect = el.tagName === 'SELECT';
            el.addEventListener(isSelect ? 'change' : 'input', (e) => {
                const idx = parseInt(e.target.getAttribute('data-index'));
                const key = e.target.getAttribute('data-key');
                const rawVal = e.target.value;

                if (key === 'carType' && rawVal === '__custom__') {
                    items[idx].isCustom = true;
                    items[idx].carType = '';
                    renderItems();
                    return;
                }

                items[idx][key] = rawVal;
                if (e.target.classList.contains('statement-input')) {
                    resizeStatementInput(e.target);
                }
                updateTotals();
            });
        });

        document.querySelectorAll('.btn-toggle-select').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const idx = parseInt(e.target.getAttribute('data-index'));
                items[idx].isCustom = false;
                items[idx].carType = CAR_OPTIONS[0];
                renderItems();
            });
        });

        document.querySelectorAll('[data-add-row]').forEach(btn => {
            btn.addEventListener('click', () => addNewItem());
        });

        document.querySelectorAll('.btn-del-row').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const idx = parseInt(e.target.getAttribute('data-index'));
                items.splice(idx, 1);
                renderItems();
            });
        });
    }

    function addNewItem() {
        markQuoteDirty();
        items.push({
            carType: '',
            quantity: '',
            duration: '',
            typeOfRent: 'Yearly / سنوي',
            rentalPrice: '',
            extraKmPrice: '',
            isCustom: false
        });
        renderItems();
    }

    btnAddItem.addEventListener('click', addNewItem);

    btnGenRef.addEventListener('click', () => {
        generateAutoMeta();
        markQuoteDirty();
    });

    btnReset.addEventListener('click', () => {
        if (confirm('هل أنت تأكد من إعادة ضبط البيانات إلى الحالة الأصلية؟')) {
            markQuoteDirty();
            currentEditingQuoteId = null;
            lastSavedQuoteId = null;
            if (btnSaveQuote) btnSaveQuote.hidden = true;
            items = JSON.parse(JSON.stringify(defaultItems));
            document.getElementById('client-name').value = '';
            const termsAr = document.getElementById('terms-ar');
            const termsEn = document.getElementById('terms-en');
            if (termsAr) termsAr.value = '';
            if (termsEn) termsEn.value = '';
            generateAutoMeta();
            renderItems();
        }
    });

    btnPrint.addEventListener('click', async () => {
        btnPrint.disabled = true;
        try {
            const quoteId = await ensureSavedBeforeOutput('desktop');
            if (!quoteId) return;
            // النسخة المخزنة هي نفس قالب PDF A4 الذي تستخدمه المنظومة.\n            window.print();
        } catch (error) {
            console.error('Print save error:', error);
            alert(`تعذر حفظ نسخة PDF قبل الطباعة.\n${error.message || error}`);
        } finally {
            btnPrint.disabled = false;
        }
    });

    // ============================================================
    // Supabase + Device tracking + Manager-only administration
    // ============================================================
    const SUPABASE_URL = "https://hlxthevwrberbrsujeqj.supabase.co";
    const SUPABASE_ANON_KEY = "sb_publishable_lpCw-zOKEyHYzmXr8UEOIg_3UlbLSNN";

    const SUPABASE_READY =
        typeof window.supabase !== 'undefined' &&
        SUPABASE_URL.includes('.supabase.co') &&
        !SUPABASE_URL.includes('YOUR-PROJECT') &&
        SUPABASE_ANON_KEY &&
        !SUPABASE_ANON_KEY.includes('YOUR_PUBLISHABLE');

    const supabaseClient = SUPABASE_READY
        ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
        : null;

    const DEVICE_ID_KEY = 'nisr_quote_device_id_v1';
    const DEVICE_NAME_KEY = 'nisr_quote_device_name_v1';
    let currentDeviceId = localStorage.getItem(DEVICE_ID_KEY);
    let currentDeviceName = localStorage.getItem(DEVICE_NAME_KEY);
    let isManager = false;
    let managerUser = null;
    let currentEditingQuoteId = null;
    let quoteDirty = true;
    let suppressDirty = false;
    let lastSavedFingerprint = null;
    let lastSavedQuoteId = null;

    function createDeviceId() {
        const uuid = (window.crypto && crypto.randomUUID)
            ? crypto.randomUUID()
            : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
        return `DEV-${uuid.replace(/-/g, '').slice(0, 12).toUpperCase()}`;
    }

    function getDeviceInfo() {
        return {
            platform: navigator.platform || '',
            language: navigator.language || '',
            userAgent: navigator.userAgent || '',
            screen: `${window.screen?.width || 0}x${window.screen?.height || 0}`
        };
    }

    function ensureDeviceIdentity() {
        if (!currentDeviceId) {
            currentDeviceId = createDeviceId();
            localStorage.setItem(DEVICE_ID_KEY, currentDeviceId);
        }
        if (!currentDeviceName) {
            const suggested = `${navigator.platform || 'جهاز'} - ${window.innerWidth <= 768 ? 'جوال' : 'كمبيوتر'}`;
            const entered = prompt(
                `أدخل اسم هذا الجهاز ليظهر مع عروض الأسعار المحفوظة.\nمثال: مكتب المبيعات - أحمد`,
                suggested
            );
            currentDeviceName = (entered || suggested || 'جهاز غير مسمى').trim();
            localStorage.setItem(DEVICE_NAME_KEY, currentDeviceName);
        }
        return { deviceId: currentDeviceId, deviceName: currentDeviceName };
    }

    const deviceIdentity = ensureDeviceIdentity();

    const btnSaveQuote = document.getElementById('btn-save-quote');
    const btnHistory = document.getElementById('btn-history');
    const btnManagerLogin = document.getElementById('btn-manager-login');
    const historyModal = document.getElementById('quote-history-modal');
    const btnCloseHistory = document.getElementById('btn-close-history');
    const btnHistoryRefresh = document.getElementById('btn-history-refresh');
    const historySearch = document.getElementById('quote-history-search');
    const historyTbody = document.getElementById('quote-history-tbody');
    const historyStatus = document.getElementById('quote-history-status');
    const deviceSummary = document.getElementById('device-summary');

    const managerLoginModal = document.getElementById('manager-login-modal');
    const managerLoginForm = document.getElementById('manager-login-form');
    const managerEmail = document.getElementById('manager-email');
    const managerPassword = document.getElementById('manager-password');
    const managerLoginStatus = document.getElementById('manager-login-status');
    const btnCloseManagerLogin = document.getElementById('btn-close-manager-login');

    function databaseReadyMessage() {
        return 'قاعدة البيانات غير مفعلة بعد. افتح script.js وضع SUPABASE_URL و SUPABASE_ANON_KEY الخاصين بمشروعك ثم أعد تحميل الموقع.';
    }

    function markQuoteDirty() {
        if (suppressDirty) return;
        quoteDirty = true;
    }

    function getClientName() {
        return (document.getElementById('client-name')?.value || '').trim();
    }

    function getTermsAr() { return document.getElementById('terms-ar')?.value || ''; }
    function getTermsEn() { return document.getElementById('terms-en')?.value || ''; }

    function calculateQuoteTotals() {
        return items.reduce((totals, item) => {
            const qty = parseNum(item.quantity, false);
            const price = parseNum(item.rentalPrice, true);
            const net = qty * price;
            const vat = net * 0.15;
            totals.net += net;
            totals.vat += vat;
            totals.grand += net + vat;
            return totals;
        }, { net: 0, vat: 0, grand: 0 });
    }

    function buildQuotePayload() {
        const totals = calculateQuoteTotals();
        return {
            quote_ref: (quoteRefInput.value || '').trim(),
            quote_date: (quoteDateInput.value || '').trim(),
            client_name: getClientName(),
            items: JSON.parse(JSON.stringify(items)),
            total_net: Number(totals.net.toFixed(2)),
            total_vat: Number(totals.vat.toFixed(2)),
            total_grand: Number(totals.grand.toFixed(2)),
            terms_ar: getTermsAr(),
            terms_en: getTermsEn(),
            device_id: deviceIdentity.deviceId,
            device_name: deviceIdentity.deviceName,
            device_info: getDeviceInfo()
        };
    }

    function fingerprintQuote(payload) {
        return JSON.stringify({
            quote_ref: payload.quote_ref,
            quote_date: payload.quote_date,
            client_name: payload.client_name,
            items: payload.items,
            total_net: payload.total_net,
            total_vat: payload.total_vat,
            total_grand: payload.total_grand,
            terms_ar: payload.terms_ar,
            terms_en: payload.terms_en
        });
    }

    function setSaveButtonState(loading) {
        if (!btnSaveQuote) return;
        btnSaveQuote.disabled = loading;
        btnSaveQuote.dataset.originalText ||= btnSaveQuote.innerHTML;
        btnSaveQuote.innerHTML = loading ? '⏳ جاري الحفظ...' : btnSaveQuote.dataset.originalText;
    }

    async function insertNewQuote({ silent = false, pdfMode = null } = {}) {
        if (!supabaseClient) {
            if (!silent) alert(databaseReadyMessage());
            return null;
        }

        const quoteRef = (quoteRefInput.value || '').trim();
        const clientName = getClientName();
        if (!quoteRef) {
            if (!silent) { alert('يرجى إدخال رقم عرض السعر أولاً.'); quoteRefInput.focus(); }
            return null;
        }
        if (!clientName) {
            if (!silent) { alert('يرجى إدخال اسم العميل أولاً.'); document.getElementById('client-name')?.focus(); }
            return null;
        }

        const payload = buildQuotePayload();
        const fingerprint = fingerprintQuote(payload);
        if (!quoteDirty && lastSavedFingerprint === fingerprint && lastSavedQuoteId) return { id: lastSavedQuoteId, quote_ref: quoteRef };

        setSaveButtonState(true);
        let generatedPdf = null;
        let pdfPath = null;
        let quoteId = (window.crypto && crypto.randomUUID) ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
        try {
            // نجهز ملف PDF أولًا ونرفعه باسم UUID للعرض، ثم ننشئ سجل العرض مع مسار الملف.
            // بهذا لا يحتاج المستخدم العادي إلى UPDATE على جدول quotes.
            if (pdfMode) {
                generatedPdf = await buildPdfBlob(pdfMode);
                const safeRef = String(payload.quote_ref || 'Quotation').replace(/[^\u0600-\u06FF\w\-]+/g, '_');
                pdfPath = `quotes/${quoteId}/${Date.now()}_${safeRef}.pdf`;
                const { error: uploadError } = await supabaseClient.storage
                    .from('quote-pdfs')
                    .upload(pdfPath, generatedPdf.blob, { contentType: 'application/pdf', upsert: false, cacheControl: '3600' });
                if (uploadError) throw uploadError;
            }

            const insertPayload = {
                ...payload,
                id: quoteId,
                ...(pdfPath ? {
                    pdf_path: pdfPath,
                    pdf_filename: generatedPdf.filename,
                    pdf_size: generatedPdf.blob.size,
                    pdf_uploaded_at: new Date().toISOString()
                } : {})
            };

            let { error } = await supabaseClient
                .from('quotes')
                .insert(insertPayload);
            let data = { id: quoteId, quote_ref: payload.quote_ref, pdf_path: pdfPath, pdf_filename: generatedPdf?.filename || null };

            if (error && (error.code === '23505' || /duplicate|unique/i.test(error.message || ''))) {
                // نغيّر رقم العرض فقط ثم نعيد الإدراج بنفس آلية PDF.
                const firstPdfPath = pdfPath;
                if (firstPdfPath) {
                    try { await supabaseClient.storage.from('quote-pdfs').remove([firstPdfPath]); } catch (_) {}
                }
                generateAutoMeta();
                const retryPayload = buildQuotePayload();
                quoteId = (window.crypto && crypto.randomUUID) ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
                pdfPath = null;
                generatedPdf = null;
                if (pdfMode) {
                    generatedPdf = await buildPdfBlob(pdfMode);
                    const safeRef = String(retryPayload.quote_ref || 'Quotation').replace(/[^\u0600-\u06FF\w\-]+/g, '_');
                    pdfPath = `quotes/${quoteId}/${Date.now()}_${safeRef}.pdf`;
                    const { error: retryUploadError } = await supabaseClient.storage
                        .from('quote-pdfs')
                        .upload(pdfPath, generatedPdf.blob, { contentType: 'application/pdf', upsert: false, cacheControl: '3600' });
                    if (retryUploadError) throw retryUploadError;
                }
                ({ error } = await supabaseClient
                    .from('quotes')
                    .insert({
                        ...retryPayload,
                        id: quoteId,
                        ...(pdfPath ? { pdf_path: pdfPath, pdf_filename: generatedPdf.filename, pdf_size: generatedPdf.blob.size, pdf_uploaded_at: new Date().toISOString() } : {})
                    }));
                data = { id: quoteId, quote_ref: retryPayload.quote_ref, pdf_path: pdfPath, pdf_filename: generatedPdf?.filename || null };
                if (!error && !silent) alert(`✓ تم الحفظ برقم جديد ${retryPayload.quote_ref} لأن الرقم السابق مستخدم بالفعل.`);
            }

            if (error) throw error;
            lastSavedFingerprint = fingerprintQuote(buildQuotePayload());
            quoteDirty = false;
            currentEditingQuoteId = null;
            lastSavedQuoteId = data?.id || null;
            if (!silent) alert(`✓ تم حفظ عرض السعر ${data.quote_ref}${pdfPath ? ' ونسخة PDF' : ''} بنجاح.`);
            return data || null;
        } catch (error) {
            console.error('Insert quote error:', error);
            // إذا رُفع PDF لكن فشل إنشاء سجل العرض، نحاول تنظيف الملف المعلّق.
            if (pdfPath) {
                try { await supabaseClient.storage.from('quote-pdfs').remove([pdfPath]); } catch (_) {}
            }
            if (!silent) alert(`تعذر حفظ العرض وملف PDF.\n${error.message || error}`);
            return null;
        } finally {
            setSaveButtonState(false);
        }
    }

    async function updateManagerQuote() {
        if (!isManager || !currentEditingQuoteId || !supabaseClient) return null;
        const payload = buildQuotePayload();
        setSaveButtonState(true);
        try {
            const { data, error } = await supabaseClient
                .from('quotes')
                .update({ ...payload, updated_at: new Date().toISOString() })
                .eq('id', currentEditingQuoteId)
                .select('id,quote_ref,pdf_path,pdf_filename')
                .single();
            if (error) throw error;
            quoteDirty = false;
            lastSavedFingerprint = fingerprintQuote(buildQuotePayload());
            lastSavedQuoteId = data?.id || currentEditingQuoteId;
            // المدير يحفظ البيانات ونسخة PDF الجديدة معًا.
            try {
                const generated = await buildPdfBlob('desktop');
                const uploaded = await uploadQuotePdf(lastSavedQuoteId, generated.blob, generated.filename, { silent: true });
                if (!uploaded) alert('تم حفظ بيانات التعديل، لكن تعذر تحديث ملف PDF المحفوظ. يمكنك إعادة حفظ التعديل لاحقًا.');
            } catch (pdfError) {
                console.error('Manager PDF update error:', pdfError);
                alert(`تم حفظ بيانات التعديل، لكن تعذر تحديث ملف PDF.\n${pdfError.message || pdfError}`);
            }
            alert(`✓ تم تحديث عرض السعر ${data.quote_ref} بواسطة المدير.`);
            return data;
        } catch (error) {
            console.error('Manager update error:', error);
            alert(`تعذر حفظ تعديل المدير.\n${error.message || error}`);
            return null;
        } finally {
            setSaveButtonState(false);
        }
    }

    async function ensureSavedBeforeOutput(mode = 'desktop') {
        if (!supabaseClient) {
            alert(databaseReadyMessage());
            return null;
        }
        // المدير إذا كان يعدل عرضًا محفوظًا يجب أن يحفظ التعديل صراحةً قبل الطباعة/PDF.
        if (isManager && currentEditingQuoteId && quoteDirty) {
            alert('يوجد تعديل على عرض محفوظ. اضغط «حفظ تعديل المدير» أولاً ثم قم بالطباعة أو تنزيل PDF.');
            return null;
        }

        let quoteId = currentEditingQuoteId || lastSavedQuoteId;
        if (!quoteDirty && lastSavedFingerprint && quoteId) {
            return quoteId;
        }

        const saved = await insertNewQuote({ silent: false, pdfMode: mode });
        return saved?.id || null;
    }

    async function buildPdfBlob(mode = 'mobile') {
        const pages = Array.from(document.querySelectorAll('#document-to-pdf .a4-page'))
            .filter(page => getComputedStyle(page).display !== 'none');

        if (!pages.length) throw new Error('No printable pages found');
        if (typeof html2canvas !== 'function') throw new Error('html2canvas is not loaded');

        const jsPDFCtor = window.jspdf && window.jspdf.jsPDF
            ? window.jspdf.jsPDF
            : window.jsPDF;
        if (typeof jsPDFCtor !== 'function') throw new Error('jsPDF is not loaded');

        const A4_WIDTH_MM = 210;
        const A4_HEIGHT_MM = 297;
        const A4_WIDTH_PX = 794;
        const A4_HEIGHT_PX = 1123;
        const renderScale = mode === 'desktop'
            ? 2
            : Math.min(2, Math.max(1.5, window.devicePixelRatio || 1));

        const pdf = new jsPDFCtor({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4',
            compress: true,
            putOnlyUsedFonts: true
        });

        const stage = document.createElement('div');
        stage.id = 'pdf-export-stage';
        stage.className = `pdf-export-stage-${mode}`;
        stage.setAttribute('aria-hidden', 'true');
        stage.style.cssText = [
            'position:fixed','left:-100000px','top:0',
            `width:${A4_WIDTH_PX}px`,`height:${A4_HEIGHT_PX}px`,
            'overflow:hidden','margin:0','padding:0','background:#ffffff',
            'z-index:-1','pointer-events:none'
        ].join(';');
        document.body.appendChild(stage);

        const exportStyle = document.createElement('style');
        exportStyle.textContent = `
            #pdf-export-stage, #pdf-export-stage * { box-sizing: border-box !important; }
            #pdf-export-stage .a4-page { width:210mm !important; height:297mm !important; min-width:210mm !important; max-width:210mm !important; min-height:297mm !important; max-height:297mm !important; margin:0 !important; padding:0 !important; overflow:hidden !important; position:relative !important; box-shadow:none !important; border:0 !important; page-break-after:auto !important; break-after:auto !important; transform:none !important; zoom:1 !important; background-size:100% 100% !important; background-repeat:no-repeat !important; background-position:center center !important; -webkit-print-color-adjust:exact !important; print-color-adjust:exact !important; }
            #pdf-export-stage .no-print, #pdf-export-stage .btn-toggle-select, #pdf-export-stage .row-action-col { display:none !important; }
            #pdf-export-stage .editable-field { border:none !important; border-color:transparent !important; background:transparent !important; box-shadow:none !important; outline:none !important; padding:0 !important; }
            /* Keep the date and quotation number inputs positioned exactly like the live form. */
            #pdf-export-stage .doc-meta-row { display:flex !important; justify-content:space-between !important; align-items:center !important; padding:0 2px !important; }
            #pdf-export-stage .doc-meta-row .meta-item { display:flex !important; align-items:center !important; gap:6px !important; }
            #pdf-export-stage .doc-meta-row .meta-input { width:140px !important; padding:1px 4px !important; margin:0 !important; direction:rtl !important; text-align:right !important; font-family:var(--font-arabic),Tajawal,sans-serif !important; font-size:inherit !important; font-weight:700 !important; line-height:normal !important; }
            #pdf-export-stage .doc-meta-row #quote-date { display:none !important; }
            #pdf-export-stage .doc-meta-row .quote-date-export { display:inline-block !important; width:140px !important; margin:0 !important; padding:1px 4px !important; direction:ltr !important; unicode-bidi:isolate !important; text-align:right !important; white-space:nowrap !important; font-family:var(--font-arabic),Tajawal,sans-serif !important; font-size:inherit !important; font-weight:700 !important; line-height:normal !important; }
            #pdf-export-stage .terms-print-text { min-height:30px !important; height:auto !important; font-size:12px !important; line-height:1.25 !important; white-space:pre-wrap !important; overflow-wrap:anywhere !important; }
            #pdf-export-stage .terms-print-text.ar-box { direction:rtl !important; text-align:right !important; }
            #pdf-export-stage .terms-print-text.en-box { direction:ltr !important; text-align:left !important; unicode-bidi:plaintext !important; font-family:Tajawal,Arial,sans-serif !important; font-size:12px !important; line-height:1.2 !important; }
            #pdf-export-stage .table-select, #pdf-export-stage .car-type-select { appearance:none !important; -webkit-appearance:none !important; -moz-appearance:none !important; border:none !important; background:transparent !important; box-shadow:none !important; outline:none !important; color:#000 !important; text-align:center !important; text-align-last:center !important; width:100% !important; padding:0 !important; }
            #pdf-export-stage .terms-box textarea { border:none !important; background:transparent !important; resize:none !important; outline:none !important; height:auto !important; min-height:30px !important; overflow:visible !important; white-space:pre-wrap !important; font-size:12px !important; line-height:1.25 !important; }
            #pdf-export-stage .quote-table tbody tr { height:auto !important; min-height:0 !important; }
            #pdf-export-stage .quote-table tbody td { height:auto !important; min-height:0 !important; vertical-align:top !important; overflow:visible !important; }
            #pdf-export-stage .statement-input { display:block !important; width:100% !important; height:auto !important; min-height:0 !important; max-height:none !important; overflow:visible !important; white-space:pre-wrap !important; overflow-wrap:anywhere !important; word-break:break-word !important; resize:none !important; line-height:1.3 !important; padding:0 2px !important; }
            #pdf-export-stage .statement-print-text { display:block !important; width:100% !important; min-height:22px !important; height:auto !important; max-height:none !important; overflow:visible !important; white-space:pre-wrap !important; overflow-wrap:anywhere !important; word-break:break-word !important; line-height:1.3 !important; padding:0 2px !important; }
            #pdf-export-stage .terms-print-text { height:auto !important; min-height:30px !important; overflow:visible !important; white-space:pre-wrap !important; overflow-wrap:anywhere !important; font-size:12px !important; line-height:1.25 !important; }
            #pdf-export-stage.pdf-export-stage-desktop .a4-page { height:296mm !important; min-height:296mm !important; max-height:296mm !important; }
            #pdf-export-stage.pdf-export-stage-desktop .table-select, #pdf-export-stage.pdf-export-stage-desktop .car-type-select { font-size:.74rem !important; font-weight:800 !important; color:#000 !important; }
            #pdf-export-stage.pdf-export-stage-desktop .terms-box textarea { background:transparent !important; }
        `;
        stage.appendChild(exportStyle);

        const waitForImages = async (root) => {
            const images = Array.from(root.querySelectorAll('img'));
            await Promise.all(images.map(img => {
                if (img.complete && img.naturalWidth > 0) return Promise.resolve();
                return new Promise(resolve => {
                    const done = () => resolve();
                    img.addEventListener('load', done, { once: true });
                    img.addEventListener('error', done, { once: true });
                    setTimeout(done, 4000);
                });
            }));
        };

        const syncFormValues = (source, clone) => {
            const sourceFields = source.querySelectorAll('input, textarea, select');
            const cloneFields = clone.querySelectorAll('input, textarea, select');
            sourceFields.forEach((field, index) => {
                const target = cloneFields[index];
                if (!target) return;
                if (field.tagName === 'TEXTAREA') {
                    target.value = field.value;
                    target.textContent = field.value;
                    target.style.height = 'auto';
                    target.style.minHeight = field.classList.contains('statement-input') ? '0' : '';
                    target.style.height = Math.max(field.id.startsWith('terms-') ? 60 : (field.classList.contains('statement-input') ? 22 : 24), target.scrollHeight) + 'px';
                } else if (field.tagName === 'SELECT') {
                    Array.from(target.options).forEach(option => option.selected = option.value === field.value);
                    target.setAttribute('data-pdf-value', field.value);
                } else {
                    target.value = field.value;
                    target.setAttribute('value', field.value);
                }
            });

            // html2canvas may clip native textarea contents. Render terms as styled text blocks in the PDF clone.
            clone.querySelectorAll('#terms-ar, #terms-en').forEach(area => {
                const replacement = document.createElement('div');
                replacement.className = area.id === 'terms-ar' ? 'terms-print-text ar-box' : 'terms-print-text en-box';
                const isArabic = area.id === 'terms-ar';
                const value = area.value || '';
                replacement.dir = isArabic ? 'rtl' : 'ltr';
                replacement.style.cssText = 'display:block;width:100%;min-height:30px;height:auto;box-sizing:border-box;padding:2px;text-align:' + (isArabic ? 'right' : 'left') + ';font-family:var(--font-arabic),Tajawal,Arial,sans-serif;font-size:12px;line-height:1.25;color:#111;background:transparent;border:0;letter-spacing:normal;';
                if (isArabic && value) {
                    // Draw Arabic with the browser's native canvas text shaper, then let
                    // html2canvas capture the bitmap. This avoids broken Arabic glyph shaping
                    // that can happen when textarea text is copied into cloned HTML.
                    const textCanvas = document.createElement('canvas');
                    const ctx = textCanvas.getContext('2d');
                    const pixelRatio = 2;
                    const logicalWidth = 330;
                    const fontSize = 12;
                    const lineHeight = 15;
                    textCanvas.width = logicalWidth * pixelRatio;
                    ctx.scale(pixelRatio, pixelRatio);
                    ctx.font = '500 ' + fontSize + 'px Tajawal, Arial, sans-serif';
                    ctx.direction = 'rtl';
                    ctx.textAlign = 'right';
                    const maxWidth = logicalWidth - 12;
                    const lines = [];
                    value.split(/\r?\n/).forEach(paragraph => {
                        if (!paragraph) { lines.push(''); return; }
                        let line = '';
                        paragraph.split(/\s+/).forEach(word => {
                            const candidate = line ? line + ' ' + word : word;
                            if (line && ctx.measureText(candidate).width > maxWidth) {
                                lines.push(line);
                                line = word;
                            } else line = candidate;
                        });
                        lines.push(line);
                    });
                    const height = Math.max(60, lines.length * lineHeight + 8);
                    textCanvas.height = height * pixelRatio;
                    const draw = textCanvas.getContext('2d');
                    draw.scale(pixelRatio, pixelRatio);
                    draw.font = '500 ' + fontSize + 'px Tajawal, Arial, sans-serif';
                    draw.direction = 'rtl';
                    draw.textAlign = 'right';
                    draw.textBaseline = 'top';
                    draw.fillStyle = '#111111';
                    lines.forEach((line, index) => draw.fillText(line, logicalWidth - 6, 4 + index * lineHeight));
                    textCanvas.style.cssText = 'display:block;width:100%;height:' + height + 'px;object-fit:fill;';
                    replacement.appendChild(textCanvas);
                } else {
                    replacement.style.whiteSpace = 'pre-wrap';
                    replacement.textContent = value;
                }
                area.replaceWith(replacement);
            });

            // Keep statement fields as native textareas in the export clone. This preserves the
            // browser's exact Arabic shaping and bidi rendering from the entry screen.
            // Their heights are expanded after the clone is attached below, before html2canvas runs.
        };

        try {
            // Load the actual Arabic font weights before html2canvas snapshots the page.
            // A fallback font is a common cause of disconnected Arabic glyphs in generated PDFs.
            if (document.fonts) {
                await Promise.all([
                    document.fonts.load('500 12px Tajawal', 'الملاحظات والشروط'),
                    document.fonts.load('800 24px Tajawal', 'النسر الثاقب'),
                    document.fonts.ready
                ]);
            }
            if (termsAr && termsAr.value.trim()) {
                if (termsTranslationPromise) await Promise.race([termsTranslationPromise, new Promise(resolve => setTimeout(resolve, 8000))]);
                await new Promise(resolve => setTimeout(resolve, 50));
            }
            for (let i = 0; i < pages.length; i++) {
                const sourcePage = pages[i];
                const clone = sourcePage.cloneNode(true);
                syncFormValues(sourcePage, clone);
                // Render the date as isolated LTR text so Arabic bidi rules cannot move "م" before the date.
                const dateInput = clone.querySelector('#quote-date');
                if (dateInput) {
                    const dateText = document.createElement('span');
                    dateText.className = 'quote-date-export';
                    dateText.textContent = sourcePage.querySelector('#quote-date')?.value ?? dateInput.value ?? '';
                    dateInput.replaceWith(dateText);
                }
                // Lock the company title to the page center in the actual export clone.
                clone.querySelectorAll('.company-brand').forEach(brand => {
                    brand.style.setProperty('width', '100%', 'important');
                    brand.style.setProperty('text-align', 'center', 'important');
                });
                clone.querySelectorAll('.company-title').forEach(title => {
                    title.style.setProperty('display', 'block', 'important');
                    title.style.setProperty('width', '100%', 'important');
                    title.style.setProperty('margin-left', 'auto', 'important');
                    title.style.setProperty('margin-right', 'auto', 'important');
                    title.style.setProperty('text-align', 'center', 'important');
                    title.style.setProperty('text-align-last', 'center', 'important');
                    title.style.setProperty('letter-spacing', 'normal', 'important');
                });
                // Center the recipient company name in the row next to "السادة /".
                clone.querySelectorAll('.client-row').forEach(row => {
                    row.style.setProperty('display', 'flex', 'important');
                    row.style.setProperty('align-items', 'center', 'important');
                    row.style.setProperty('width', '100%', 'important');
                });
                clone.querySelectorAll('.client-input').forEach(input => {
                    input.style.setProperty('text-align', 'center', 'important');
                    input.style.setProperty('text-align-last', 'center', 'important');
                    input.style.setProperty('direction', 'rtl', 'important');
                    input.style.setProperty('font-family', 'Tajawal, Arial, sans-serif', 'important');
                });
                stage.appendChild(clone);
                await waitForImages(clone);
                await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));

                // Render statement text like the Arabic terms: use a shaped canvas and wrap to the real cell width.
                clone.querySelectorAll('textarea.statement-input').forEach((area, fieldIndex) => {
                    const sourceField = sourcePage.querySelectorAll('textarea.statement-input')[fieldIndex];
                    const style = window.getComputedStyle(sourceField || area);
                    const value = sourceField ? sourceField.value : (area.value || '');
                    const logicalWidth = Math.max(80, Math.floor(area.getBoundingClientRect().width || area.parentElement?.getBoundingClientRect().width || 330));
                    const fontSize = parseFloat(style.fontSize) || 14;
                    const lineHeight = Math.max(fontSize * 1.25, parseFloat(style.lineHeight) || fontSize * 1.3);
                    const ratio = 2, pad = 4;
                    const canvas = document.createElement('canvas');
                    let ctx = canvas.getContext('2d');
                    const font = style.font || (style.fontWeight + ' ' + fontSize + 'px ' + style.fontFamily);
                    const direction = style.direction || 'rtl';
                    const align = (direction === 'ltr' || style.textAlign === 'left') ? 'left' : 'right';
                    ctx.font = font;
                    const maxWidth = logicalWidth - pad * 2;
                    const lines = [];
                    value.split(/\\r?\\n/).forEach(paragraph => {
                        if (!paragraph) { lines.push(''); return; }
                        let line = '';
                        paragraph.split(/\\s+/).forEach(word => {
                            const candidate = line ? line + ' ' + word : word;
                            if (line && ctx.measureText(candidate).width > maxWidth) {
                                lines.push(line); line = word;
                            } else if (!line && ctx.measureText(word).width > maxWidth) {
                                let part = '';
                                Array.from(word).forEach(char => {
                                    if (part && ctx.measureText(part + char).width > maxWidth) { lines.push(part); part = char; }
                                    else part += char;
                                });
                                line = part;
                            } else line = candidate;
                        });
                        lines.push(line);
                    });
                    const height = Math.max(lineHeight + 6, lines.length * lineHeight + 6);
                    canvas.width = Math.ceil(logicalWidth * ratio);
                    canvas.height = Math.ceil(height * ratio);
                    ctx = canvas.getContext('2d');
                    ctx.scale(ratio, ratio);
                    ctx.font = font;
                    ctx.direction = direction;
                    ctx.textAlign = align;
                    ctx.textBaseline = 'top';
                    ctx.fillStyle = style.color || '#111';
                    const x = align === 'right' ? logicalWidth - pad : pad;
                    lines.forEach((line, lineIndex) => ctx.fillText(line, x, 3 + lineIndex * lineHeight));
                    canvas.style.cssText = 'display:block;width:100%;height:' + height + 'px;max-width:100%;';
                    const block = document.createElement('div');
                    block.className = 'statement-print-text';
                    block.style.cssText = 'display:block;width:100%;height:auto;min-height:' + height + 'px;box-sizing:border-box;overflow:visible;padding:0;margin:0;';
                    block.appendChild(canvas);
                    area.replaceWith(block);
                    const row = block.closest('tr');
                    if (row) { row.style.setProperty('height', 'auto', 'important'); row.style.setProperty('min-height', '0', 'important'); }
                });
                await new Promise(resolve => requestAnimationFrame(resolve));

                // Recalculate each statement textarea after the export clone is attached and has its final width.
                // This preserves every wrapped line and lets the table row grow to fit the full statement.
                clone.querySelectorAll('.statement-print-text').forEach(field => {
                    field.style.setProperty('height', 'auto', 'important');
                    field.style.setProperty('min-height', '22px', 'important');
                    field.style.setProperty('max-height', 'none', 'important');
                    field.style.setProperty('overflow', 'visible', 'important');
                    const row = field.closest('tr');
                    if (row) { row.style.setProperty('height', 'auto', 'important'); row.style.setProperty('min-height', '0', 'important'); }
                });
                await new Promise(resolve => requestAnimationFrame(resolve));

                // Fit the full Arabic/English terms block into the available A4 space before rendering.
                // Reduce only terms typography/spacing as needed; never impose a fixed height that clips text.
                const termsContainer = clone.querySelector('.terms-translation-container');
                const bankSection = clone.querySelector('.bank-details-section');
                const footer = clone.querySelector('.doc-footer-fixed');
                if (termsContainer && bankSection && footer) {
                    // Keep the English export text at the same fixed visual size as the Arabic canvas text.
                    // The old fit loop shrank HTML text but could not shrink the Arabic canvas bitmap,
                    // which made English look much smaller in the exported PDF.
                    const termsTextBlocks = Array.from(termsContainer.querySelectorAll('textarea, .terms-print-text:not(.en-box)'));
                    let fontSize = 0.75;
                    let lineHeight = 1.25;
                    let marginTop = 10;
                    for (let attempt = 0; attempt < 18; attempt++) {
                        termsTextBlocks.forEach(block => {
                            block.style.setProperty('font-size', fontSize + 'rem', 'important');
                            block.style.setProperty('line-height', String(lineHeight), 'important');
                            block.style.setProperty('padding', '2px', 'important');
                            block.style.setProperty('min-height', '0', 'important');
                            block.style.setProperty('height', 'auto', 'important');
                            block.style.setProperty('max-height', 'none', 'important');
                            block.style.setProperty('overflow', 'visible', 'important');
                        });
                        termsContainer.style.setProperty('margin-top', marginTop + 'px', 'important');
                        const bankRect = bankSection.getBoundingClientRect();
                        const footerRect = footer.getBoundingClientRect();
                        if (bankRect.bottom <= footerRect.top - 6) break;
                        fontSize = Math.max(0.5, fontSize * 0.9);
                        lineHeight = Math.max(1.0, lineHeight - 0.02);
                        marginTop = Math.max(0, marginTop - 1);
                    }
                    clone.querySelectorAll('.terms-print-text.en-box').forEach(block => {
                        block.style.setProperty('font-family', 'Tajawal, Arial, sans-serif', 'important');
                        block.style.setProperty('font-size', '12px', 'important');
                        block.style.setProperty('font-weight', '500', 'important');
                        block.style.setProperty('line-height', '15px', 'important');
                        block.style.setProperty('letter-spacing', 'normal', 'important');
                    });
                }

                const printableBody = clone.querySelector('.doc-inner-body');
                const pageFooter = clone.querySelector('.doc-footer-fixed');
                if (printableBody && pageFooter) {
                    printableBody.style.setProperty('top', '40mm', 'important');
                    printableBody.style.setProperty('bottom', 'auto', 'important');
                    printableBody.style.setProperty('height', 'auto', 'important');
                    printableBody.style.setProperty('overflow', 'visible', 'important');
                    printableBody.style.setProperty('transform-origin', 'top left', 'important');
                    printableBody.style.setProperty('transform', 'none', 'important');
                    printableBody.style.setProperty('right', 'auto', 'important');
                    printableBody.style.setProperty('width', '182mm', 'important');
                    const naturalHeight = Math.max(printableBody.scrollHeight, printableBody.getBoundingClientRect().height, 1);
                    const footerTop = pageFooter.getBoundingClientRect().top;
                    const bodyTop = printableBody.getBoundingClientRect().top;
                    const availableHeight = Math.max(100, footerTop - bodyTop - 8);
                    const fitScale = Math.min(1, availableHeight / naturalHeight);
                    printableBody.style.setProperty('width', 'calc(182mm / ' + fitScale + ')', 'important');
                    printableBody.style.setProperty('transform', 'scale(' + fitScale + ')', 'important');
                }

                const canvas = await html2canvas(clone, {
                    scale: renderScale, width:A4_WIDTH_PX, height:A4_HEIGHT_PX,
                    windowWidth:A4_WIDTH_PX, windowHeight:A4_HEIGHT_PX,
                    x:0, y:0, scrollX:0, scrollY:0,
                    useCORS:true, allowTaint:false, backgroundColor:'#ffffff',
                    imageTimeout:15000, logging:false, removeContainer:true
                });
                if (i > 0) pdf.addPage('a4', 'portrait');
                const imageData = canvas.toDataURL('image/png');
                pdf.addImage(imageData, 'PNG', 0, 0, A4_WIDTH_MM, A4_HEIGHT_MM, undefined, 'FAST');
                stage.removeChild(clone);
            }
            const refVal = quoteRefInput.value || 'Quotation';
            const suffix = mode === 'desktop' ? 'كمبيوتر' : 'جوال';
            const filename = `عرض_سعر_${refVal}_${suffix}.pdf`;
            const blob = pdf.output('blob');
            return { blob, filename };
        } finally {
            stage.remove();
        }
    }

    async function uploadQuotePdf(quoteId, pdfBlob, filename, { silent = false } = {}) {
        if (!supabaseClient || !quoteId || !pdfBlob) return false;
        const safeRef = String(quoteRefInput.value || 'Quotation').replace(/[^\u0600-\u06FF\w\-]+/g, '_');
        const path = `quotes/${quoteId}/${Date.now()}_${safeRef}.pdf`;
        try {
            // نحذف الملف القديم بعد نجاح الرفع الجديد، حتى لا تضيع النسخة السابقة إذا فشل الرفع.
            let oldPath = null;
            if (isManager) {
                const { data: oldRow } = await supabaseClient.from('quotes').select('pdf_path').eq('id', quoteId).single();
                oldPath = oldRow?.pdf_path || null;
            }
            const { error: uploadError } = await supabaseClient.storage
                .from('quote-pdfs')
                .upload(path, pdfBlob, { contentType: 'application/pdf', upsert: false, cacheControl: '3600' });
            if (uploadError) throw uploadError;

            const { error: updateError } = await supabaseClient.from('quotes').update({
                pdf_path: path,
                pdf_filename: filename,
                pdf_size: pdfBlob.size,
                pdf_uploaded_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            }).eq('id', quoteId);
            if (updateError) throw updateError;

            if (oldPath && oldPath !== path) {
                await supabaseClient.storage.from('quote-pdfs').remove([oldPath]);
            }
            return true;
        } catch (error) {
            console.error('PDF upload error:', error);
            if (!silent) alert(`تم حفظ بيانات العرض، لكن تعذر حفظ ملف PDF في قاعدة البيانات.\n${error.message || error}`);
            return false;
        }
    }

    async function buildAgreementPdfBlob() {
        if (!agreementSheet || typeof html2canvas !== 'function') throw new Error('مكتبة إنشاء PDF غير متاحة');
        const jsPDFCtor = window.jspdf?.jsPDF || window.jsPDF;
        if (typeof jsPDFCtor !== 'function') throw new Error('مكتبة jsPDF غير متاحة');

        const PAGE_W = 794;
        const PAGE_H = 1123;
        const TOP = Math.round(42 * PAGE_H / 297);
        const BOTTOM = Math.round(17 * PAGE_H / 297);
        const SIDE = Math.round(14 * PAGE_W / 210);
        const CONTENT_H = PAGE_H - TOP - BOTTOM;
        const scale = Math.min(2, Math.max(1.5, window.devicePixelRatio || 1));

        if (document.fonts) {
            await Promise.all([
                document.fonts.load('500 12px Tajawal', 'اتفاقية إقرار والتزام مالي'),
                document.fonts.load('800 24px Tajawal', 'النسر الثاقب'),
                document.fonts.ready
            ]);
        }

        const stage = document.createElement('div');
        stage.id = 'agreement-pdf-export-stage';
        stage.style.cssText = 'position:fixed;left:-100000px;top:0;width:'+PAGE_W+'px;margin:0;padding:0;z-index:-1;pointer-events:none;';
        const style = document.createElement('style');
        style.textContent = `
          #agreement-pdf-export-stage, #agreement-pdf-export-stage * { box-sizing:border-box !important; }
          #agreement-pdf-export-stage .agreement-pdf-page { position:relative !important; width:${PAGE_W}px !important; height:${PAGE_H}px !important; min-height:${PAGE_H}px !important; max-height:${PAGE_H}px !important; overflow:hidden !important; margin:0 !important; padding:0 !important; background:#fff url('https://i.postimg.cc/Bbs40NJc/alkhlfyt.jpg') center center / 100% 100% no-repeat !important; }
          #agreement-pdf-export-stage .agreement-pdf-header { position:absolute !important; top:19px !important; left:${SIDE}px !important; right:${SIDE}px !important; height:98px !important; overflow:hidden !important; }
          #agreement-pdf-export-stage .agreement-pdf-footer { position:absolute !important; left:${SIDE}px !important; right:${SIDE}px !important; bottom:18px !important; margin:0 !important; }
          #agreement-pdf-export-stage .agreement-pdf-content { position:absolute !important; top:${TOP}px !important; left:${SIDE}px !important; right:${SIDE}px !important; width:auto !important; height:${CONTENT_H}px !important; max-height:${CONTENT_H}px !important; overflow:hidden !important; margin:0 !important; padding:0 !important; font-family:Tajawal,Arial,sans-serif !important; font-size:10pt !important; line-height:1.42 !important; color:#1f2937 !important; }
          #agreement-pdf-export-stage .agreement-pdf-content > * { max-width:100% !important; }
          #agreement-pdf-export-stage .agreement-clause { break-inside:auto !important; page-break-inside:auto !important; }
        `;
        stage.appendChild(style);
        document.body.appendChild(stage);

        const makePage = (sourcePage) => {
            const page = document.createElement('div');
            page.className = 'agreement-pdf-page';
            const header = sourcePage?.querySelector('.doc-header-fixed')?.cloneNode(true);
            const footer = sourcePage?.querySelector('.doc-footer-fixed')?.cloneNode(true);
            const content = document.createElement('div');
            content.className = 'agreement-pdf-content';
            if (header) { header.className += ' agreement-pdf-header'; page.appendChild(header); }
            page.appendChild(content);
            if (footer) { footer.className += ' agreement-pdf-footer'; page.appendChild(footer); }
            stage.appendChild(page);
            return { page, content };
        };

        const waitImages = async root => {
            await Promise.all(Array.from(root.querySelectorAll('img')).map(img => {
                if (img.complete && img.naturalWidth) return Promise.resolve();
                return new Promise(resolve => {
                    const done = () => resolve();
                    img.addEventListener('load', done, {once:true});
                    img.addEventListener('error', done, {once:true});
                    setTimeout(done, 5000);
                });
            }));
        };

        try {
            const livePages = Array.from(agreementSheet.querySelectorAll('.agreement-live-page'));
            if (!livePages.length) throw new Error('صفحات الاتفاقية غير موجودة');
            const sourceEntries = livePages.flatMap((sourcePage,pageIndex) =>
                Array.from(sourcePage.querySelector('.agreement-print-content')?.children || [])
                    .map(node => ({node,sourcePage,pageIndex}))
            );
            if (!sourceEntries.length) throw new Error('لا توجد بنود لتصديرها');

            const livePage = agreementSheet.querySelector('.agreement-live-page:not([style*="display: none"])') || agreementSheet.querySelector('.agreement-live-page');
            if (!livePage) throw new Error('صفحة الاتفاقية غير موجودة');
            const sourceContent = livePage.querySelector('.agreement-print-content');
            if (!sourceContent || !sourceContent.children.length) throw new Error('لا توجد بنود لتصديرها');
            const current = makePage(livePage);
            current.content.style.fontSize = window.getComputedStyle(sourceContent).fontSize;
            current.content.style.lineHeight = window.getComputedStyle(sourceContent).lineHeight;
            Array.from(sourceContent.children).forEach(node => {
                const clone = node.cloneNode(true);
                clone.querySelectorAll('.no-print, [data-ag-remove-clause]').forEach(el => el.remove());
                current.content.appendChild(clone);
            });
            await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
            // Keep all text and both signatures on one A4 page; scale proportionally only if needed.
            let fit = Math.min(1, CONTENT_H / Math.max(current.content.scrollHeight, 1));
            if (fit < 1) {
                current.content.style.width = (100 / fit) + '%';
                current.content.style.transform = 'scale(' + fit + ')';
                current.content.style.transformOrigin = 'top right';
            }
            await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));

            const pages = Array.from(stage.querySelectorAll('.agreement-pdf-page'));
            const pdf = new jsPDFCtor({orientation:'portrait',unit:'mm',format:'a4',compress:true,putOnlyUsedFonts:true});
            for (let i=0; i<pages.length; i++) {
                await waitImages(pages[i]);
                await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
                const canvas = await html2canvas(pages[i], {
                    scale, width:PAGE_W, height:PAGE_H, windowWidth:PAGE_W, windowHeight:PAGE_H,
                    x:0, y:0, scrollX:0, scrollY:0, useCORS:true, allowTaint:false,
                    backgroundColor:'#ffffff', imageTimeout:15000, logging:false, removeContainer:true
                });
                if (i) pdf.addPage('a4','portrait');
                pdf.addImage(canvas.toDataURL('image/png'),'PNG',0,0,210,297,undefined,'FAST');
            }
            const number = ag('number')?.value || 'Agreement';
            return {blob:pdf.output('blob'), filename:'اتفاقية_التزام_'+String(number).replace(/[^\\u0600-\\u06FF\\w-]+/g,'_')+'.pdf'};
        } finally {
            stage.remove();
        }
    }

    async function exportAgreementPdf(button) {
        if (!isManager || !button) return;
        const oldLabel = button.innerHTML;
        button.disabled = true;
        button.innerText = 'جاري تجهيز PDF للجوال...';
        document.body.classList.add('rendering-pdf');
        try {
            if (agreementSheet?.dataset.userEdited !== 'true') renderAgreementSheet(agreementDataFromForm());
            const generated = await buildAgreementPdfBlob();
            const url = URL.createObjectURL(generated.blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = generated.filename;
            document.body.appendChild(link);
            link.click();
            link.remove();
            setTimeout(() => URL.revokeObjectURL(url), 30000);
        } catch (error) {
            console.error('Agreement PDF export error:', error);
            alert('تعذر إنشاء PDF للاتفاقية.\\n' + (error.message || error));
        } finally {
            document.body.classList.remove('rendering-pdf');
            button.disabled = false;
            button.innerHTML = oldLabel;
        }
    }

    async function savePdfForQuote(quoteId, mode = 'desktop') {
        if (!quoteId) return false;
        const generated = await buildPdfBlob(mode);
        return uploadQuotePdf(quoteId, generated.blob, generated.filename, { silent: false });
    }

    async function downloadSavedQuotePdf(id) {
        if (!isManager || !supabaseClient || !id) return;
        try {
            const { data: row, error } = await supabaseClient.from('quotes').select('pdf_path,pdf_filename,quote_ref').eq('id', id).single();
            if (error) throw error;
            if (!row?.pdf_path) throw new Error('ملف PDF غير موجود لهذا العرض.');
            const { data, error: signError } = await supabaseClient.storage.from('quote-pdfs').createSignedUrl(row.pdf_path, 300);
            if (signError) throw signError;
            window.open(data.signedUrl, '_blank', 'noopener,noreferrer');
        } catch (error) {
            alert(`تعذر فتح ملف PDF.\n${error.message || error}`);
        }
    }


    function openHistoryModal() {
        if (!isManager) { openManagerLoginModal(); return; }
        if (!historyModal) return;
        historyModal.classList.add('is-open');
        historyModal.setAttribute('aria-hidden', 'false');
        if (deviceSummary) deviceSummary.textContent = `وضع المدير — الجهاز الحالي: ${deviceIdentity.deviceName} — ${deviceIdentity.deviceId}`;
        loadQuoteHistory();
    }

    function closeHistoryModal() {
        if (!historyModal) return;
        historyModal.classList.remove('is-open');
        historyModal.setAttribute('aria-hidden', 'true');
    }

    function openManagerLoginModal() {
        if (!managerLoginModal) return;
        managerLoginModal.classList.add('is-open');
        managerLoginModal.setAttribute('aria-hidden', 'false');
        managerLoginStatus.textContent = '';
        setTimeout(() => managerEmail?.focus(), 50);
    }

    function closeManagerLoginModal() {
        if (!managerLoginModal) return;
        managerLoginModal.classList.remove('is-open');
        managerLoginModal.setAttribute('aria-hidden', 'true');
    }

    function setManagerUI(loggedIn, user = null) {
        isManager = loggedIn;
        managerUser = user;
        if (btnHistory) btnHistory.hidden = !loggedIn;
        if (btnOpenAgreements) btnOpenAgreements.hidden = !loggedIn;
        if (!loggedIn) showQuotes();
        if (btnSaveQuote) btnSaveQuote.hidden = !loggedIn || !currentEditingQuoteId;
        if (btnManagerLogin) {
            btnManagerLogin.innerHTML = loggedIn
                ? '<span aria-hidden="true">🚪</span> خروج المدير'
                : '<span aria-hidden="true">🔐</span> دخول المدير';
            btnManagerLogin.classList.toggle('manager-logout', loggedIn);
            btnManagerLogin.title = loggedIn ? 'تسجيل خروج المدير' : 'دخول المدير';
        }
    }

    async function verifyManager(user) {
        if (!supabaseClient || !user) return false;
        const { data, error } = await supabaseClient.rpc('is_manager');
        if (error) {
            console.error('Manager verification error:', error);
            return false;
        }
        return data === true;
    }

    async function handleManagerLogin(event) {
        event.preventDefault();
        if (!supabaseClient) { managerLoginStatus.textContent = databaseReadyMessage(); return; }
        managerLoginStatus.textContent = 'جاري التحقق...';
        try {
            const { data, error } = await supabaseClient.auth.signInWithPassword({
                email: managerEmail.value.trim(),
                password: managerPassword.value
            });
            if (error) throw error;
            const manager = await verifyManager(data.user);
            if (!manager) {
                await supabaseClient.auth.signOut();
                throw new Error('هذا الحساب ليس لديه صلاحية المدير.');
            }
            setManagerUI(true, data.user);
            closeManagerLoginModal();
            managerPassword.value = '';
            alert('✓ تم تسجيل دخول المدير بنجاح.');
            openHistoryModal();
        } catch (error) {
            console.error('Manager login error:', error);
            managerLoginStatus.textContent = `تعذر تسجيل الدخول: ${error.message || error}`;
        }
    }

    async function handleManagerButton() {
        if (!isManager) { openManagerLoginModal(); return; }
        if (supabaseClient) await supabaseClient.auth.signOut();
        setManagerUI(false, null);
        closeHistoryModal();
        currentEditingQuoteId = null;
        lastSavedQuoteId = null;
        quoteReadOnly = false;
        document.body.classList.remove('quote-read-only');
        document.getElementById('document-to-pdf').inert = false;
        if (btnSaveQuote) btnSaveQuote.hidden = true;
        alert('تم تسجيل خروج المدير.');
    }

    function escapeHtml(value) {
        return String(value ?? '')
            .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;').replace(/'/g, '&#039;');
    }

    function formatHistoryDate(value) {
        if (!value) return '-';
        const d = new Date(value);
        if (Number.isNaN(d.getTime())) return escapeHtml(value);
        return d.toLocaleString('ar-SA', { dateStyle: 'medium', timeStyle: 'short' });
    }

    function renderQuoteHistory(rows) {
        if (!historyTbody) return;
        if (!rows.length) {
            historyTbody.innerHTML = '<tr><td colspan="7" class="quote-history-empty">لا توجد عروض محفوظة.</td></tr>';
            return;
        }
        historyTbody.innerHTML = rows.map(row => `
            <tr>
                <td>${escapeHtml(row.quote_ref)}</td>
                <td>${escapeHtml(row.client_name)}</td>
                <td>${escapeHtml(row.quote_date)}</td>
                <td>${formatMoney(Number(row.total_grand || 0), 2)} ر.س</td>
                <td>${escapeHtml(row.device_name)}<br><small>${escapeHtml(row.device_id)}</small></td>
                <td>${formatHistoryDate(row.created_at)}</td>
                <td>
                    <div class="quote-history-action">
                        ${row.pdf_path ? `<button type="button" class="quote-history-pdf" data-pdf-quote="${escapeHtml(row.id)}">PDF</button>` : '<span class="quote-history-no-pdf">بدون PDF</span>'}
                        <button type="button" class="quote-history-open" data-view-quote="${escapeHtml(row.id)}">فتح</button>
                        <button type="button" class="quote-history-edit" data-edit-quote="${escapeHtml(row.id)}">تعديل</button>
                        <button type="button" class="quote-history-delete" data-delete-quote="${escapeHtml(row.id)}">حذف</button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    async function loadQuoteHistory() {
        if (!historyStatus) return;
        if (!isManager || !supabaseClient) {
            historyStatus.textContent = !supabaseClient ? databaseReadyMessage() : 'سجل العروض متاح للمدير فقط.';
            renderQuoteHistory([]);
            return;
        }
        historyStatus.textContent = 'جاري تحميل العروض...';
        const search = (historySearch?.value || '').trim();
        try {
            let query = supabaseClient
                .from('quotes')
                .select('id,quote_ref,quote_date,client_name,total_grand,device_id,device_name,created_at,updated_at,pdf_path,pdf_filename')
                .order('created_at', { ascending: false }).limit(500);
            if (search) {
                const safe = search.replace(/,/g, ' ');
                query = query.or(`quote_ref.ilike.%${safe}%,client_name.ilike.%${safe}%,device_name.ilike.%${safe}%,device_id.ilike.%${safe}%`);
            }
            const { data, error } = await query;
            if (error) throw error;
            renderQuoteHistory(data || []);
            historyStatus.textContent = `${(data || []).length} عرض محفوظ`;
        } catch (error) {
            console.error('History error:', error);
            historyStatus.textContent = `تعذر تحميل السجل: ${error.message || error}`;
            renderQuoteHistory([]);
        }
    }

    async function openSavedQuote(id, mode = 'edit') {
        if (!isManager || !supabaseClient || !id) return;
        try {
            const { data, error } = await supabaseClient.from('quotes').select('*').eq('id', id).single();
            if (error) throw error;
            if (!data) return;
            suppressDirty = true;
            quoteReadOnly = mode === 'view';
            document.body.classList.toggle('quote-read-only', quoteReadOnly);
            document.getElementById('document-to-pdf').inert = quoteReadOnly;
            currentEditingQuoteId = data.id;
            lastSavedQuoteId = data.id;
            items = Array.isArray(data.items) && data.items.length ? JSON.parse(JSON.stringify(data.items)) : JSON.parse(JSON.stringify(defaultItems));
            quoteRefInput.value = data.quote_ref || '';
            quoteDateInput.value = data.quote_date || '';
            const clientInput = document.getElementById('client-name');
            if (clientInput) clientInput.value = data.client_name || '';
            const ar = document.getElementById('terms-ar');
            const en = document.getElementById('terms-en');
            if (ar) ar.value = data.terms_ar || '';
            if (en) en.value = data.terms_en || '';
            renderItems();
            suppressDirty = false;
            quoteDirty = false;
            lastSavedFingerprint = fingerprintQuote(buildQuotePayload());
            if (btnSaveQuote) btnSaveQuote.hidden = quoteReadOnly;
            closeHistoryModal();
            window.scrollTo({ top: 0, behavior: 'smooth' });
            alert(quoteReadOnly
                ? `تم فتح عرض السعر ${data.quote_ref} للمعاينة فقط. لا يمكن تعديل بياناته.`
                : `تم فتح عرض السعر ${data.quote_ref} في وضع التعديل.`);
            return true;
        } catch (error) {
            suppressDirty = false;
            console.error('Open quote error:', error);
            alert(`تعذر فتح العرض.\n${error.message || error}`);
            return false;
        }
    }

    async function exportSavedQuotePdf(id) {
        if (!isManager || !supabaseClient || !id) return;
        try {
            // Load the saved quote in preview mode and use the exact mobile PDF renderer.
            const loaded = await openSavedQuote(id, 'view');
            if (!loaded || currentEditingQuoteId !== id || !quoteReadOnly) return;
            const generated = await buildPdfBlob('mobile');
            const url = URL.createObjectURL(generated.blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = generated.filename;
            document.body.appendChild(link);
            link.click();
            link.remove();
            setTimeout(() => URL.revokeObjectURL(url), 30000);
        } catch (error) {
            console.error('Saved quote mobile PDF error:', error);
            alert(`تعذر إنشاء PDF للعرض المحفوظ.\n${error.message || error}`);
        }
    }

    async function deleteSavedQuote(id) {
        if (!isManager || !supabaseClient || !id) return;
        if (!confirm('هل تريد حذف عرض السعر المحفوظ؟ لا يمكن التراجع عن هذه العملية.')) return;
        try {
            const { data: row, error: fetchError } = await supabaseClient.from('quotes').select('pdf_path').eq('id', id).single();
            if (fetchError) throw fetchError;
            if (row?.pdf_path) {
                const { error: storageError } = await supabaseClient.storage.from('quote-pdfs').remove([row.pdf_path]);
                if (storageError) console.warn('PDF storage delete warning:', storageError);
            }
            const { error } = await supabaseClient.from('quotes').delete().eq('id', id);
            if (error) throw error;
            await loadQuoteHistory();
        } catch (error) {
            console.error('Delete quote error:', error);
            alert(`تعذر حذف العرض.\n${error.message || error}`);
        }
    }

    if (btnSaveQuote) btnSaveQuote.addEventListener('click', updateManagerQuote);
    if (btnHistory) btnHistory.addEventListener('click', () => { if (document.body.classList.contains('agreement-mode')) showQuotes(); else openHistoryModal(); });
    if (btnManagerLogin) btnManagerLogin.addEventListener('click', handleManagerButton);
    if (managerLoginForm) managerLoginForm.addEventListener('submit', handleManagerLogin);
    if (btnCloseManagerLogin) btnCloseManagerLogin.addEventListener('click', closeManagerLoginModal);
    if (managerLoginModal) managerLoginModal.querySelectorAll('[data-close-manager-modal]').forEach(el => el.addEventListener('click', closeManagerLoginModal));
    if (btnCloseHistory) btnCloseHistory.addEventListener('click', closeHistoryModal);
    if (historyModal) historyModal.querySelectorAll('[data-close-quote-modal]').forEach(el => el.addEventListener('click', closeHistoryModal));
    if (btnHistoryRefresh) btnHistoryRefresh.addEventListener('click', loadQuoteHistory);
    if (historySearch) historySearch.addEventListener('input', () => {
        clearTimeout(historySearch._timer);
        historySearch._timer = setTimeout(loadQuoteHistory, 300);
    });
    if (historyTbody) historyTbody.addEventListener('click', event => {
        const viewButton = event.target.closest('[data-view-quote]');
        if (viewButton) openSavedQuote(viewButton.getAttribute('data-view-quote'), 'view');
        const editButton = event.target.closest('[data-edit-quote]');
        if (editButton) openSavedQuote(editButton.getAttribute('data-edit-quote'), 'edit');
        const pdfButton = event.target.closest('[data-pdf-quote]');
        if (pdfButton) exportSavedQuotePdf(pdfButton.getAttribute('data-pdf-quote'));
        const deleteButton = event.target.closest('[data-delete-quote]');
        if (deleteButton) deleteSavedQuote(deleteButton.getAttribute('data-delete-quote'));
    });

    document.querySelectorAll('#terms-ar, #terms-en').forEach(field => {
        field.style.height = 'auto';
        field.style.height = Math.max(60, field.scrollHeight) + 'px';
    });

    document.addEventListener('input', event => {
        if (event.target.matches('#terms-ar, #terms-en')) {
            event.target.style.height = 'auto';
            event.target.style.height = Math.max(60, event.target.scrollHeight) + 'px';
        }
        if (event.target.matches('#client-name, #quote-date, #quote-ref, #terms-ar, #terms-en, input[data-index], select[data-index], textarea')) markQuoteDirty();
    });
    document.addEventListener('change', event => {
        if (event.target.matches('#client-name, #quote-date, #quote-ref, #terms-ar, #terms-en, input[data-index], select[data-index]')) markQuoteDirty();
    });

    document.addEventListener('keydown', event => {
        if (event.key === 'Escape') { closeHistoryModal(); closeManagerLoginModal(); }
    });

    if (supabaseClient) {
        supabaseClient.auth.getSession().then(async ({ data }) => {
            if (data?.session?.user && await verifyManager(data.session.user)) {
                setManagerUI(true, data.session.user);
            } else {
                setManagerUI(false, null);
            }
        });
        supabaseClient.auth.onAuthStateChange(async (_event, session) => {
            if (session?.user && await verifyManager(session.user)) setManagerUI(true, session.user);
            else setManagerUI(false, null);
        });
    } else {
        setManagerUI(false, null);
    }

    // إخراج PDF: يتم إنشاء نفس ملف A4 الذي يُنزّل للمستخدم، ثم حفظ نسخة منه في Supabase Storage.
    async function handlePdfExport(mode, button) {
        if (!button) return;
        const originalLabel = button.innerHTML;
        const loadingText = mode === 'desktop' ? 'جاري تجهيز PDF للكمبيوتر...' : 'جاري تجهيز PDF للجوال...';
        button.innerText = loadingText;
        button.disabled = true;
        if (btnExportPdfMobile) btnExportPdfMobile.disabled = true;
        if (btnExportPdfDesktop) btnExportPdfDesktop.disabled = true;
        document.body.classList.add('rendering-pdf');
        try {
            const quoteId = await ensureSavedBeforeOutput(mode);
            if (!quoteId) return;
            // تم حفظ نسخة PDF بالفعل عند إنشاء العرض. ننشئ نسخة محلية مطابقة لتنزيلها للمستخدم.
            const generated = await buildPdfBlob(mode);
            const url = URL.createObjectURL(generated.blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = generated.filename;
            document.body.appendChild(a);
            a.click();
            a.remove();
            setTimeout(() => URL.revokeObjectURL(url), 30000);
        } catch (err) {
            console.error(`PDF ${mode} export error:`, err);
            alert('حدث خطأ أثناء إنشاء أو حفظ ملف PDF، يرجى المحاولة مرة أخرى.');
        } finally {
            document.body.classList.remove('rendering-pdf');
            button.innerHTML = originalLabel;
            if (btnExportPdfMobile) btnExportPdfMobile.disabled = false;
            if (btnExportPdfDesktop) btnExportPdfDesktop.disabled = false;
        }
    }

    if (btnExportPdfMobile) btnExportPdfMobile.addEventListener('click', () => handlePdfExport('mobile', btnExportPdfMobile));
    if (btnExportPdfDesktop) btnExportPdfDesktop.addEventListener('click', () => handlePdfExport('desktop', btnExportPdfDesktop));

    // الترجمة التلقائية مع تمدد الحقول وانتظارها قبل تصدير PDF
    const termsAr = document.getElementById('terms-ar');
    const termsEn = document.getElementById('terms-en');
    let translateTimeout;
    let latestTranslationRequest = 0;
    let termsTranslationPromise = Promise.resolve();

    function resizeTermsField(field) {
        if (!field) return;
        field.style.height = 'auto';
        field.style.height = Math.max(60, field.scrollHeight + 2) + 'px';
    }

    if (termsAr && termsEn) {
        // Split long notes into requests below the translation service's 500-character limit.
        function splitTranslationText(text, maxLength = 450) {
            const chunks = [];
            let current = '';
            const paragraphs = text.split(/(\r?\n)/);
            for (const part of paragraphs) {
                if (/^\r?\n$/.test(part)) {
                    if (current.trim()) chunks.push(current.trimEnd());
                    current = '';
                    chunks.push('\n');
                    continue;
                }
                const words = part.match(/\S+\s*/g) || [];
                for (const word of words) {
                    if (current.length + word.length > maxLength && current.trim()) {
                        chunks.push(current.trimEnd());
                        current = '';
                    }
                    let remaining = word;
                    while (remaining.length > maxLength) {
                        if (current.trim()) {
                            chunks.push(current.trimEnd());
                            current = '';
                        }
                        chunks.push(remaining.slice(0, maxLength));
                        remaining = remaining.slice(maxLength);
                    }
                    current += remaining;
                }
                if (current.trim()) {
                    chunks.push(current.trimEnd());
                    current = '';
                }
            }
            return chunks.filter(chunk => chunk === '\n' || chunk.trim());
        }

        async function translateChunk(chunk) {
            if (chunk === '\n') return '\n';
            // Use a same-origin Vercel endpoint first to avoid browser CORS/network restrictions.
            try {
                const response = await fetch('/api/translate', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ text: chunk })
                });
                const data = await response.json().catch(() => ({}));
                if (response.ok && data && typeof data.translatedText === 'string' && data.translatedText.trim()) {
                    return data.translatedText.trim();
                }
                throw new Error(data.error || 'Translation endpoint failed (' + response.status + ')');
            } catch (proxyError) {
                // Browser-side providers remain as a fallback if the server endpoint is unavailable.
                try {
                    const response = await fetch('https://translate.googleapis.com/translate_a/single?client=gtx&sl=ar&tl=en&dt=t&q=' + encodeURIComponent(chunk));
                    if (!response.ok) throw new Error('Google translation unavailable (' + response.status + ')');
                    const data = await response.json();
                    const translated = data && Array.isArray(data[0]) ? data[0].map(item => item && item[0] || '').join('').trim() : '';
                    if (!translated) throw new Error('Google returned an empty translation');
                    return translated;
                } catch (googleError) {
                    const response = await fetch('https://api.mymemory.translated.net/get?q=' + encodeURIComponent(chunk) + '&langpair=ar%7Cen');
                    if (!response.ok) throw new Error('Translation failed. ' + (proxyError.message || '') + ' ' + (googleError.message || '') + ' MyMemory HTTP ' + response.status);
                    const data = await response.json();
                    const translated = data && data.responseData ? String(data.responseData.translatedText || '').trim() : '';
                    if (!translated || /MYMEMORY WARNING/i.test(translated)) throw new Error('Translation services returned no translation. Check internet connection and try again.');
                    return translated;
                }
            }
        }

        termsAr.addEventListener('input', () => {
            resizeTermsField(termsAr);
            clearTimeout(translateTimeout);
            const text = termsAr.value.trim();
            const requestId = ++latestTranslationRequest;
            if (!text) {
                termsEn.value = '';
                resizeTermsField(termsEn);
                termsTranslationPromise = Promise.resolve();
                return;
            }

            termsTranslationPromise = new Promise(resolve => {
                translateTimeout = setTimeout(async () => {
                    try {
                        const chunks = splitTranslationText(text);
                        const translatedChunks = [];
                        for (const chunk of chunks) {
                            if (requestId !== latestTranslationRequest) return;
                            translatedChunks.push(await translateChunk(chunk));
                        }
                        if (requestId === latestTranslationRequest) {
                            termsEn.value = translatedChunks.join(' ').replace(/[ \t]*\n[ \t]*/g, '\n');
                            termsEn.placeholder = 'Translated terms...';
                            termsEn.title = '';
                            resizeTermsField(termsEn);
                            markQuoteDirty();
                        }
                    } catch (error) {
                        if (requestId === latestTranslationRequest) {
                            console.error('Translation error:', error);
                            termsEn.value = '';
                            termsEn.placeholder = 'Translation failed. Check your internet connection and edit the Arabic notes to retry.';
                            termsEn.title = 'Automatic translation failed: ' + (error && error.message ? error.message : 'service unavailable');
                        }
                    } finally {
                        resolve();
                    }
                }, 350);
            });
        });

        termsEn.addEventListener('input', () => resizeTermsField(termsEn));
        window.addEventListener('beforeprint', () => {
            resizeTermsField(termsAr);
            resizeTermsField(termsEn);
        });
        resizeTermsField(termsAr);
        resizeTermsField(termsEn);
    }

    function fitLiveDocumentForPrint() {
        const page = document.querySelector('.page-1');
        const body = page && page.querySelector('.doc-inner-body');
        const footer = page && page.querySelector('.doc-footer-fixed');
        if (!body || !footer) return;
        body.style.setProperty('top', '40mm', 'important');
        body.style.setProperty('bottom', 'auto', 'important');
        body.style.setProperty('height', 'auto', 'important');
        body.style.setProperty('overflow', 'visible', 'important');
        body.style.setProperty('transform-origin', 'top left', 'important');
        body.style.setProperty('transform', 'none', 'important');
        body.style.setProperty('right', 'auto', 'important');
        body.style.setProperty('width', '182mm', 'important');
        const naturalHeight = Math.max(body.scrollHeight, body.getBoundingClientRect().height, 1);
        const availableHeight = Math.max(100, footer.getBoundingClientRect().top - body.getBoundingClientRect().top - 8);
        const fitScale = Math.min(1, availableHeight / naturalHeight);
        body.style.setProperty('width', 'calc(182mm / ' + fitScale + ')', 'important');
        body.style.setProperty('transform', 'scale(' + fitScale + ')', 'important');
    }

    function resetLivePrintFit() {
        const body = document.querySelector('.page-1 .doc-inner-body');
        if (!body) return;
        ['top','bottom','height','overflow','transform-origin','transform','right','width'].forEach(prop => body.style.removeProperty(prop));
    }

    window.addEventListener('beforeprint', fitLiveDocumentForPrint);
    window.addEventListener('afterprint', resetLivePrintFit);


    // Agreements: manager-only workspace, persisted in Supabase with RLS.
    const agreementWorkspace = document.getElementById('agreement-workspace');
    const btnOpenAgreements = document.getElementById('btn-open-agreements');
    const agreementForm = document.getElementById('agreement-form');
    const agreementList = document.getElementById('agreement-list');
    const agreementStatus = document.getElementById('agreement-list-status');
    const agreementSheet = document.getElementById('agreement-print-sheet');
    const agreementFields = ['number','date','title','first-name','first-id','first-address','first-phone','second-name','second-id','second-address','second-phone','kind','amount','percent','basis','description','evidence','payment','first-due','schedule','bank','extra','city','copies'];
    let currentAgreementId = null;
    let agreementRows = [];
    const ag = key => document.getElementById('ag-' + key);
    const agEsc = value => String(value ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
    function agreementDataFromForm() {
      const data = {};
      agreementFields.forEach(key => data[key] = ag(key)?.value?.trim() || '');
      const liveContent = agreementSheet?.querySelector('.agreement-print-content');
      data.custom_html = agreementSheet?.dataset.userEdited === 'true' && agreementSheet ? agreementSheet.innerHTML : '';
      data.template_version = 2;
      return data;
    }
    function fillAgreementForm(data = {}) {
      agreementFields.forEach(key => { if (ag(key)) ag(key).value = data[key] || ''; });
      document.getElementById('agreement-id').value = currentAgreementId || '';
      renderAgreementSheet(data);
    }
    function newAgreement() {
      if (!isManager) return;
      currentAgreementId = null;
      agreementForm.reset();
      document.getElementById('agreement-id').value = '';
      ag('date').value = new Date().toISOString().slice(0,10);
      ag('number').value = 'AGR-' + new Date().toISOString().slice(0,10).replace(/-/g,'') + '-' + Math.floor(100 + Math.random()*900);
      ag('title').value = 'عقد تقديم خدمات';
      ag('city').value = 'الرياض';
      ag('copies').value = 'نسختان أصليتان';
      if (agreementSheet) agreementSheet.dataset.userEdited = 'false';
      renderAgreementSheet(agreementDataFromForm());
    }
    function agreementClauseText(data) {
      const isPercent = data.kind === 'percentage';
      const value = isPercent
        ? 'نسبة ' + (data.percent || '........') + '% من ' + (data.basis || 'وعاء احتساب يحدد كتابةً')
        : 'مبلغ إجمالي قدره ' + (data.amount || '........') + ' ريال سعودي';
      const clauses = [
        'التمهيد والتعاريف: يعد التمهيد وبيانات الطرفين ووصف سبب الالتزام والمستندات المحددة في هذه الاتفاقية جزءاً لا يتجزأ منها ومكملاً ومفسراً لبنودها.',
        'الإقرار بأصل الالتزام: يقر الطرف الثاني، بعد اطلاعه على المستندات وبيان سبب الالتزام، بثبوت التزامه لصالح الطرف الأول بـ' + value + '، ويلتزم بأدائه وفق أحكام هذه الاتفاقية. ويجب أن تكون قيمة الالتزام أو آلية احتسابها محددة وقابلة للتحقق دون جهالة.',
        'تحديد النسبة عند اختيار الالتزام النسبي: إذا كان الالتزام نسبة مئوية، فيجب تحديد الوعاء الذي تحتسب منه النسبة، والفترة الزمنية، وطريقة إثباته، وما يدخل فيه وما يستبعد منه. ولا يعتد بأي تغيير في الوعاء إلا بموافقة كتابية من الطرفين.',
        'مواعيد السداد: يلتزم الطرف الثاني بالسداد في المواعيد والمبالغ المحددة في جدول السداد. وإذا كان السداد على أقساط، فيعد كل قسط مستحقاً في التاريخ المحدد له، ويثبت كل سداد بتحويل بنكي أو سند قبض أو مستند كتابي صادر من الطرف الأول.',
        'طريقة الوفاء وإثباته: يكون السداد بالطريقة المتفق عليها، ولا تبرأ ذمة الطرف الثاني إلا بمقدار المبالغ التي تم استلامها فعلياً وثبتت بمستند معتبر. وتوضح بيانات الحساب البنكي في هذه الاتفاقية، ويكون أي تغيير فيها بإشعار مكتوب موثق من الطرف الأول.',
        'المبالغ المسددة والرصيد: يخصم كل مبلغ مسدد من أصل الالتزام، ويحق لأي من الطرفين طلب كشف مكتوب يوضح الدفعات المسددة والمتبقي. ولا يعد استلام دفعة جزئية تنازلاً عن باقي الحق أو تعديلاً لمواعيد الاستحقاق ما لم يتفق الطرفان كتابةً على خلاف ذلك.',
        'الإخلال والتأخر: عند تأخر الطرف الثاني عن سداد مبلغ مستحق، يحق للطرف الأول مطالبته كتابةً بالوفاء، واتخاذ الإجراءات النظامية للمطالبة بأصل الحق وما يجوز نظاماً من تعويض أو مصروفات. ولا تنشأ فوائد أو غرامات أو جزاءات مالية تلقائياً بموجب هذه الصيغة، ولا يطالب إلا بما تجيزه الأنظمة والاتفاقات الصحيحة.',
        'عدم التنازل والتعديل: لا يعد سكوت الطرف الأول أو منحه مهلة أو قبوله سداداً جزئياً تنازلاً عن أي حق. ولا يكون أي تعديل أو تمديد أو تسوية أو إبراء نافذاً إلا بموجب محرر مكتوب يوافق عليه الطرفان.',
        'صحة البيانات والصلاحيات: يقر كل طرف بصحة البيانات التي قدمها وبأن من وقع عنه، إن كان ممثلاً لمنشأة، يملك الصلاحية النظامية اللازمة للتوقيع، ويتحمل كل طرف مسؤولية صحة مستنداته وصفته.',
        'الإخطارات: تكون الإخطارات والمطالبات على العناوين الوطنية ووسائل التواصل المدونة في صدر الاتفاقية، ويجب على كل طرف إشعار الآخر كتابةً بأي تغيير فيها. وتراعى في التبليغ وسائل الإثبات والمتطلبات النظامية ذات الصلة.',
        'السرية والمستندات: يلتزم الطرفان بالمحافظة على سرية البيانات والمستندات المتبادلة وعدم استخدامها إلا لغرض تنفيذ هذه الاتفاقية، مع عدم الإخلال بما يلزم الإفصاح عنه للجهات المختصة أو بموجب النظام.',
        'القانون والاختصاص: تخضع هذه الاتفاقية للأنظمة المعمول بها في المملكة العربية السعودية، ويكون نظر أي نزاع للجهة القضائية المختصة نوعياً ومكانياً وفق قواعد الاختصاص النظامية، ولا يغير تحديد المدينة في هذه الاتفاقية قواعد الاختصاص الآمرة.',
        'النسخ والتوقيع: حررت هذه الاتفاقية من ' + (data.copies || 'نسختين أصليتين') + '، تسلم كل طرف نسخة للعمل بموجبها. ويقر الطرفان بأنهما قرآ جميع البنود وفهما آثارها ووقعا بإرادتهما المعتبرة، مع إرفاق ما يلزم من هويات وتفويضات ومستندات مؤيدة.'
      ];
      if (data.extra) clauses.push('شروط خاصة إضافية اتفق عليها الطرفان: ' + data.extra);
      if (data.evidence) clauses.push('المستندات المؤيدة للالتزام: ' + data.evidence);
      return clauses;
    }
    function agreementPageShell(content, continuation = false) {
      const header = `
        <header class="doc-header-fixed">
          <div class="company-brand"><h1 class="company-title">النسر الثاقب</h1><p class="company-sub">السجل التجاري 7054465872</p><p class="company-sub">الرقم الضريبي 314823033100003</p></div>
          <div class="company-logo"><img src="https://i.postimg.cc/Pfm5Rvd0/logo.png" alt="شعار النسر الثاقب" class="official-logo-img"></div>
        </header>`;
      const footer = `<footer class="doc-footer-fixed"><div class="footer-content"><span>العنوان : - الرياض – جدة</span><span class="footer-sep"></span><span>info@nisr.sa</span><span class="footer-sep"></span><span>0501767213 - 0510484749</span></div></footer>`;
      return `<section class="agreement-live-page a4-page ${continuation ? 'agreement-page-2' : 'agreement-page-1'}">${header}<div class="agreement-print-content" contenteditable="false" spellcheck="false">${content}</div>${footer}</section>`;
    }

    function upgradeLegacyAgreementHtml(html) {
      const temp = document.createElement('div');
      temp.innerHTML = html;
      if (temp.querySelectorAll('.agreement-live-page').length >= 2) return html;
      const oldContent = temp.querySelector('.agreement-print-content');
      if (!oldContent) return html;
      const nodes = Array.from(oldContent.children);
      const clauseIndexes = nodes.reduce((list,node,index) => node.classList.contains('agreement-clause') ? [...list,index] : list, []);
      const splitAt = clauseIndexes.length > 6 ? clauseIndexes[5] + 1 : Math.max(1, Math.ceil(nodes.length / 2));
      const first = document.createElement('div');
      const second = document.createElement('div');
      nodes.forEach((node,index) => (index < splitAt ? first : second).appendChild(node));
      const title = first.querySelector('.doc-title-bar');
      if (title) {
        const secondTitle = title.cloneNode(true);
        const heading = secondTitle.querySelector('.doc-title');
        if (heading) heading.textContent += ' (تكملة)';
        second.prepend(secondTitle);
      }
      const oldHeader = temp.querySelector('.doc-header-fixed')?.outerHTML || '';
      const oldFooter = temp.querySelector('.doc-footer-fixed')?.outerHTML || '';
      const shell = (body,number) => `<section class="agreement-live-page a4-page agreement-page-${number}">${oldHeader}<div class="agreement-print-content" contenteditable="true" spellcheck="false">${body.innerHTML}</div>${oldFooter}</section>`;
      return shell(first,'1') + shell(second,'2');
    }

    function agreementEditable(field, placeholder) {
      return '<strong><span class="agreement-editable" contenteditable="true" data-ag-field="' + field + '">' + agEsc(placeholder) + '</span></strong>';
    }
    function renderAgreementSheet(data = {}) {
      if (!agreementSheet) return;
      if (data.template_version === 2 && data.custom_html) {
        let savedHtml = data.custom_html;
        const roleTextReplacements = [
          ['نقر نحن الطرف الأول (', 'نقر نحن الطرف الثاني ('],
          [') بأن الطرف الثاني (', ') بأن الطرف الأول ('],
          ['الأتعاب الموكلة للطرف الثاني', 'الأتعاب الموكلة للطرف الأول'],
          ['أتعاب الطرف الثاني:', 'أتعاب الطرف الأول:'],
          ['يلتزم الطرف الأول بأن يدفع للطرف الثاني', 'يلتزم الطرف الثاني بأن يدفع للطرف الأول'],
          ['يحق للطرف الثاني المطالبة بأتعابه وحقوقه', 'يحق للطرف الأول المطالبة بأتعابه وحقوقه'],
          ['مستحقات الطرف الثاني', 'مستحقات الطرف الأول'],
          ['"الطرف الأول" غير ملزم بدفع أي مستحقات لـ "الطرف الثاني"', '"الطرف الثاني" غير ملزم بدفع أي مستحقات لـ "الطرف الأول"']
        ];
        roleTextReplacements.forEach(([from, to]) => { savedHtml = savedHtml.split(from).join(to); });
        agreementSheet.innerHTML = savedHtml;
        agreementSheet.dataset.userEdited = 'true';
      } else {
        const first = agreementEditable('first-company', data['first-name'] || 'ادخل اسم الشركة');
        const second = agreementEditable('second-company', data['second-name'] || 'ادخل اسم الشركة');
        const firstRep = agreementEditable('first-representative', 'ادخل اسم الممثل');
        const secondRep = agreementEditable('second-representative', 'ادخل اسم الممثل');
        const firstId = agreementEditable('first-unified-id', 'ادخل الرقم الموحد');
        const secondId = agreementEditable('second-unified-id', 'ادخل الرقم الموحد');
        const project = agreementEditable('project-name', 'ادخل اسم المشروع');
        const amountOne = agreementEditable('amount-one', 'ادخل المبلغ');
        const amountTwo = agreementEditable('amount-two', 'ادخل المبلغ');
        const beneficiary = agreementEditable('bank-beneficiary', 'ادخل اسم المستفيد / الشركة');
        const bank = agreementEditable('bank-name', 'ادخل اسم البنك');
        const iban = agreementEditable('iban', 'ادخل رقم الايبان');
        const pageOne = `
          <div class="doc-title-bar"><h2 class="doc-title">عقد تقديم خدمات</h2></div>
          <p class="service-party-line"><b>الطرف الأول:</b> الاسم: ${first}، سجل تجاري الرقم الموحد ${firstId}، ويشار إليها فيما بعد بـ "الطرف الأول".</p>
          <p class="service-party-line"><b>الطرف الثاني:</b> الاسم: ${second}، الرقم الوطني الموحد ${secondId}، ويشار إليه فيما بعد بـ "الطرف الثاني".</p>
          <h3>التمهيد:</h3>
          <p>نقر نحن الطرف الثاني (${agreementEditable('second-company',data['second-name'] || 'ادخل اسم الشركة')}) بأن الطرف الأول (${agreementEditable('first-company',data['first-name'] || 'ادخل اسم الشركة')}) قدم الخدمات الاستشارية وساهم بنجاح في توقيع عقد مشروع وتنفيذ أعمال (${project}).</p>
          <p>وعليه يتفق الطرفان على الأتعاب المستحقة للطرف الأول بعد توقيع عقد المشروع حسب البنود التالية:</p>
          <h3>البند الأول: أتعاب الطرف الأول:</h3>
          <p>1- يلتزم الطرف الثاني بأن يدفع للطرف الأول مبلغ (${amountOne}) بعد توقيع العقد واستلام الموقع، والباقي مع أول مستخلص للمقدمة وهي (${amountTwo})، ويحق للطرف الأول المطالبة بأتعابه وحقوقه من خلال الجهات المختصة بحال التمنع أو التأخر في الدفع، ويتم تحويل مستحقات الطرف الأول بحد أقصاه (7) أيام من استلام الدفعة المقدمة.</p>
          <div class="agreement-bank-box"><p><b>الحساب البنكي لـ</b> ${beneficiary}</p><p><b>اسم البنك:</b> ${bank} <span class="agreement-bank-separator">|</span> <b>رقم الآيبان:</b> ${iban}</p></div>
          <p>2- "الطرف الثاني" غير ملزم بدفع أي مستحقات لـ "الطرف الأول" إن لم يتم الاتفاق على المشروع مع المالك أو أي جهة تنوب عنه أو تمثله في المشروع المذكور، ولا يحق لأي طرف ممن ذكروا بهذه الاتفاقية بأي مطالبة مالية ويكون هذا الاتفاق ملغياً.</p>
        `;
        const pageTwo = `
          <div class="doc-title-bar"><h2 class="doc-title">عقد تقديم خدمات (تكملة)</h2></div>
          <h3>البند الثالث: عدم الإفصاح المتبادل والسرية، اتفاقية عدم المنافسة:</h3>
          <p>يوافق الطرف المتلقي على استخدام المعلومات السرية، بما في ذلك المعلومات الفنية السرية، لهذا الغرض فقط وليس لأي استخدام آخر دون موافقة خطية مسبقة من الطرف المفصح. ولا يجوز له استغلال أو تسويق أو مساعدة الآخرين في استخدام هذه المعلومات، بما في ذلك في ترتيبات سلسلة القيمة أو توزيع المنتجات أو تقاسم الإيرادات. ويقتصر الإفصاح على الممثلين الذين يحتاجون إلى المعرفة، والذين يتم إبلاغهم بشروط السرية هذه وملزمين بها. وسيبذل الطرف المتلقي قصارى جهده للحفاظ على سرية هذه المعلومات.</p>
          <h3>البند الرابع: النزاعات</h3>
          <ul class="agreement-service-list"><li>في حال نشوء أي نزاع بين الطرفين، يتم محاولة حله بالطرق الودية.</li><li>إذا لم يُحل النزاع خلال (15) يوماً، يتم اللجوء إلى محاكم المملكة العربية السعودية للفصل فيه.</li><li>يتحمل الطرف الخاسر في النزاع جميع التكاليف القانونية وأتعاب المحاماة.</li></ul>
          <h3>البند الخامس: أحكام عامة</h3>
          <ul class="agreement-service-list"><li>أي تعديل لهذا العقد يجب أن يكون بموافقة خطية من الأطراف.</li><li>جميع الوثائق والمعلومات المتبادلة تعتبر سرية ولا يجوز الإفصاح عنها إلا بموافقة خطية.</li><li>تمت كتابة هذا العقد من نسختين أصليتين، سُلمت لكل طرف نسخة للعمل بموجبها.</li><li>تتم جميع المراسلات والإشعارات بين الأطراف وفق العناوين المذكورة في صدر هذا العقد.</li><li>يلتزم الطرفان بالعمل بحسن نية خلال تنفيذ هذا العقد.</li></ul>
          <p class="agreement-service-closing">والله الموفق،،،</p>
          <div class="agreement-signatures service-agreement-signatures">
            <section><h3>الطرف الأول:</h3><p>${agreementEditable('first-company',data['first-name'] || 'ادخل اسم الشركة')}</p><p>الممثل: ${firstRep}</p><p class="agreement-sign-line">التوقيع والختم: ....................................</p></section>
            <section><h3>الطرف الثاني:</h3><p>${agreementEditable('second-company',data['second-name'] || 'ادخل اسم الشركة')}</p><p>الممثل: ${secondRep}</p><p class="agreement-sign-line">التوقيع والختم: ....................................</p></section>
          </div>
        `;
        agreementSheet.innerHTML = agreementPageShell(pageOne,false) + agreementPageShell(pageTwo,true);
        agreementSheet.dataset.userEdited = 'true';
      }
      agreementSheet.querySelectorAll('.agreement-print-content').forEach(el => {
        el.setAttribute('contenteditable','false');
        el.setAttribute('spellcheck','false');
      });
      paginateServiceAgreement();
      syncAgreementCompanyNames();
    }
    function paginateServiceAgreement() {
      if (!agreementSheet) return;
      const pages = Array.from(agreementSheet.querySelectorAll('.agreement-live-page'));
      const firstPage = pages[0], secondPage = pages[1];
      const first = firstPage?.querySelector('.agreement-print-content');
      const second = secondPage?.querySelector('.agreement-print-content');
      if (!first) return;

      const allNodes = pages.flatMap(page => {
        const content = page.querySelector('.agreement-print-content');
        return content ? Array.from(content.children) : [];
      });
      first.innerHTML = '';
      allNodes.forEach(node => {
        if (node.matches('.doc-title-bar') && /تكملة/.test(node.textContent)) return;
        if (node.classList.contains('agreement-flow-block')) {
          Array.from(node.childNodes).forEach(child => first.appendChild(child));
        } else first.appendChild(node);
      });
      if (second) { second.innerHTML = ''; secondPage.style.display = 'none'; }
      firstPage.style.display = '';
      first.setAttribute('contenteditable','false');
      first.setAttribute('spellcheck','false');
      first.querySelectorAll('[data-ag-field], .agreement-clause-text').forEach(el => el.setAttribute('contenteditable','true'));

      first.style.lineHeight = '1.42';
      first.querySelectorAll('h3').forEach(el => { el.style.marginTop='5px'; el.style.marginBottom='3px'; el.style.paddingBottom='2px'; });
      first.querySelectorAll('p').forEach(el => { el.style.marginTop='3px'; el.style.marginBottom='3px'; });
      first.querySelectorAll('.agreement-bank-box').forEach(el => { el.style.margin='5px 0'; el.style.padding='5px 8px'; });
      first.querySelectorAll('.agreement-service-list').forEach(el => { el.style.margin='2px 0 4px'; el.style.paddingInlineStart='19px'; });
      first.querySelectorAll('.agreement-service-list li').forEach(el => { el.style.margin='2px 0'; el.style.lineHeight='1.38'; });
      first.querySelectorAll('.service-agreement-signatures').forEach(el => { el.style.marginTop='7px'; el.style.gap='10px'; });
      first.querySelectorAll('.service-agreement-signatures section').forEach(el => { el.style.minHeight='74px'; el.style.padding='6px 8px'; });
      first.querySelectorAll('.service-agreement-signatures h3').forEach(el => { el.style.margin='0 0 4px'; });
      first.querySelectorAll('.agreement-sign-line').forEach(el => { el.style.marginTop='7px'; });

      // Use the largest readable font that keeps every clause and both signatures on this A4 page.
      const available = Math.max(1, first.clientHeight - 2);
      let low = 10.5, high = 15, best = low;
      for (let i=0; i<12; i++) {
        const mid = (low + high) / 2;
        first.style.fontSize = mid.toFixed(2) + 'px';
        if (first.scrollHeight <= available) { best = mid; low = mid; }
        else high = mid;
      }
      first.style.fontSize = best.toFixed(2) + 'px';
      renumberAgreementClauses();
    }

    function syncAgreementCompanyNames(changedField, value) {
      if (!agreementSheet) return;
      if (changedField === 'first-company' || changedField === 'second-company') {
        agreementSheet.querySelectorAll('[data-ag-field="' + changedField + '"]').forEach(node => {
          if (node !== document.activeElement && node.textContent !== value) node.textContent = value;
        });
        const formField = ag(changedField === 'first-company' ? 'first-name' : 'second-name');
        if (formField) formField.value = value;
      }
    }
    async function loadAgreements() {
      if (!isManager || !supabaseClient) return;
      agreementStatus.textContent = 'جاري تحميل الاتفاقيات...';
      const {data,error} = await supabaseClient.from('commitment_agreements').select('*').order('created_at',{ascending:false}).limit(200);
      if (error) { agreementStatus.textContent = 'تعذر تحميل الاتفاقيات: ' + error.message; return; }
      agreementRows = data || [];
      agreementStatus.textContent = agreementRows.length ? 'عدد الاتفاقيات: ' + agreementRows.length : 'لا توجد اتفاقيات محفوظة بعد.';
      renderAgreementList();
    }
    function renderAgreementList() {
      const term = (document.getElementById('agreement-search')?.value || '').trim().toLowerCase();
      const rows = agreementRows.filter(row => [row.agreement_number,row.data?.['first-name'],row.data?.['second-name']].join(' ').toLowerCase().includes(term));
      agreementList.innerHTML = rows.map(row => '<div class="agreement-list-item"><div><b>' + agEsc(row.agreement_number) + '</b><small>' + agEsc(row.data?.['second-name'] || row.title) + '</small></div><div class="agreement-list-actions"><button type="button" data-ag-edit="' + row.id + '">فتح</button><button type="button" data-ag-delete="' + row.id + '">حذف</button></div></div>').join('') || '<p class="agreement-empty">لا توجد نتائج.</p>';
    }
    async function saveAgreement() {
      if (!isManager || !supabaseClient) return;
      const data = agreementDataFromForm();
      if (!data.custom_html) { alert('تعذر تجهيز نص العقد للحفظ. حدّث الصفحة وحاول مرة أخرى.'); return; }
      const payload = {agreement_number:data.number,agreement_date:data.date,title:data.title || 'اتفاقية إقرار والتزام مالي',data,updated_at:new Date().toISOString()};
      let result;
      if (currentAgreementId) result = await supabaseClient.from('commitment_agreements').update(payload).eq('id',currentAgreementId).select().single();
      else result = await supabaseClient.from('commitment_agreements').insert({...payload,created_by:managerUser.id}).select().single();
      if (result.error) { alert('تعذر حفظ الاتفاقية: ' + result.error.message); return; }
      currentAgreementId = result.data.id;
      document.getElementById('agreement-id').value = currentAgreementId;
      renderAgreementSheet(data);
      await loadAgreements();
      alert('تم حفظ الاتفاقية بنجاح.');
    }
    async function openAgreement(id) {
      if (!isManager) return;
      const row = agreementRows.find(item => item.id === id);
      if (!row) return;
      currentAgreementId = row.id;
      fillAgreementForm(row.data || {});
      agreementStatus.textContent = 'تم فتح الاتفاقية ' + row.agreement_number;
    }
    async function deleteAgreement(id) {
      if (!isManager || !confirm('هل تريد حذف هذه الاتفاقية نهائياً؟')) return;
      const {error} = await supabaseClient.from('commitment_agreements').delete().eq('id',id);
      if (error) { alert('تعذر حذف الاتفاقية: ' + error.message); return; }
      if (currentAgreementId === id) newAgreement();
      await loadAgreements();
    }
    function showAgreements() {
      if (!isManager) return;
      document.body.classList.add('agreement-mode');
      agreementWorkspace.hidden = false;
      document.getElementById('document-to-pdf').hidden = true;
      document.querySelector('.admin-control-bar').classList.add('agreement-header-mode');
      if (btnHistory) btnHistory.textContent = 'عروض الأسعار';
      if (btnOpenAgreements) btnOpenAgreements.textContent = '📑 اتفاقيات الالتزام';
      newAgreement();
      loadAgreements();
      window.scrollTo({top:0,behavior:'smooth'});
    }
    function showQuotes() {
      document.body.classList.remove('agreement-mode');
      agreementWorkspace.hidden = true;
      document.getElementById('document-to-pdf').hidden = false;
      document.querySelector('.admin-control-bar').classList.remove('agreement-header-mode');
      if (btnHistory) btnHistory.textContent = 'عروض الأسعار';
    }
    if (btnOpenAgreements) btnOpenAgreements.addEventListener('click',showAgreements);
    document.getElementById('btn-agreement-home')?.addEventListener('click',showQuotes);
    document.getElementById('btn-agreement-new')?.addEventListener('click',newAgreement);
    document.getElementById('btn-agreement-save')?.addEventListener('click',saveAgreement);
    document.getElementById('btn-agreement-print')?.addEventListener('click',event=>{
      exportAgreementPdf(event.currentTarget);
    });
    document.getElementById('agreement-search')?.addEventListener('input',renderAgreementList);
    agreementList?.addEventListener('click',event=>{
      const edit=event.target.closest('[data-ag-edit]'); if(edit) openAgreement(edit.dataset.agEdit);
      const del=event.target.closest('[data-ag-delete]'); if(del) deleteAgreement(del.dataset.agDelete);
    });
    agreementForm?.addEventListener('input',()=>renderAgreementSheet(agreementDataFromForm()));
    agreementSheet?.addEventListener('input', event => {
      const editable = event.target.closest('[data-ag-field]');
      if (editable) syncAgreementCompanyNames(editable.dataset.agField, editable.textContent.trim());
      agreementSheet.dataset.userEdited = 'true';
    });

    function renumberAgreementClauses() {
      agreementSheet?.querySelectorAll('.agreement-print-content .agreement-clause').forEach((clause,index) => {
        let number = clause.querySelector('.agreement-clause-number');
        if (!number) {
          number = clause.querySelector('b');
          if (!number) {
            number = document.createElement('b');
            clause.prepend(number);
          }
          number.classList.add('agreement-clause-number');
        }
        number.textContent = (index + 1) + '.';
        clause.setAttribute('data-clause-index', String(index));
        if (!clause.querySelector('.agreement-clause-remove')) {
          const remove = document.createElement('button');
          remove.type = 'button';
          remove.className = 'agreement-clause-remove no-print';
          remove.setAttribute('contenteditable','false');
          remove.setAttribute('data-ag-remove-clause','');
          remove.setAttribute('title','حذف البند');
          remove.setAttribute('aria-label','حذف البند');
          remove.textContent = '×';
          clause.appendChild(remove);
        }
      });
    }

    function addAgreementClause() {
      if (!isManager || !agreementSheet) return;
      const content = agreementSheet.querySelector('.agreement-page-1 .agreement-print-content');
      if (!content) return;
      const clause = document.createElement('p');
      clause.className = 'agreement-clause';
      const number = document.createElement('b');
      number.className = 'agreement-clause-number';
      const text = document.createElement('span');
      text.className = 'agreement-clause-text';
      text.setAttribute('contenteditable','true');
      text.textContent = 'اكتب نص البند الجديد هنا...';
      clause.append(number, document.createTextNode(' '), text);
      const signature = agreementSheet.querySelector('.agreement-signatures');
      if (signature) signature.closest('.agreement-flow-block')?.before(clause) || content.appendChild(clause);
      else content.appendChild(clause);
      paginateServiceAgreement();
      renumberAgreementClauses();
      agreementSheet.dataset.userEdited = 'true';
      text.focus();
      const range = document.createRange(); range.selectNodeContents(text);
      const selection = window.getSelection(); selection.removeAllRanges(); selection.addRange(range);
    }

    agreementSheet?.addEventListener('click', event => {
      const remove = event.target.closest('[data-ag-remove-clause]');
      if (!remove) return;
      event.preventDefault();
      event.stopPropagation();
      const clause = remove.closest('.agreement-clause');
      if (clause && confirm('هل تريد حذف هذا البند؟')) {
        clause.remove();
        renumberAgreementClauses();
        agreementSheet.dataset.userEdited = 'true';
      }
    });

    document.getElementById('btn-agreement-add-clause')?.addEventListener('click', addAgreementClause);
    agreementSheet?.addEventListener('blur', event => {
      if (event.target.closest('.agreement-print-content')) {
        paginateServiceAgreement();
        renumberAgreementClauses();
      }
    }, true);


    generateAutoMeta();
    renderItems();

});
