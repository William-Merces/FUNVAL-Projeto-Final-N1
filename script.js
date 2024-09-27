// Seleciona os elementos do DOM
const calculateButton = document.getElementById("calculate-button");
const clearAllButton = document.getElementById("clear-all");
const mortgageAmountInput = document.getElementById("MortgageAmount");
const mortgageTermInput = document.getElementById("MortgageTerm");
const interestRateInput = document.getElementById("InterestRate");
const mortgageError = document.getElementById("mortgage-error");
const interestError = document.getElementById("interest-error");
const preCalculateBlock = document.querySelector(".results-block__pre-calculate");
const postCalculateBlock = document.querySelector(".results-block__post-calculate");
const monthlyRepaymentsOutput = document.getElementById("MonthlyRepayments");
const totalRepaymentsOutput = document.getElementById("TotalRepayments");

// Adiciona event listeners
calculateButton.addEventListener("click", calculateRepayments);
clearAllButton.addEventListener("click", resetForm);

// Calcula e exibe os resultados do pagamento da hipoteca

function calculateRepayments() {
    if (validateInputs()) {
        const mortgageAmount = parseFloat(mortgageAmountInput.value);
        const mortgageTerm = parseFloat(mortgageTermInput.value);
        const interestRate = parseFloat(interestRateInput.value) / 100;
        const mortgageType = document.querySelector('input[name="MortgageType"]:checked')?.value;

        if (mortgageType) {
            const results = calculateMortgage(mortgageAmount, mortgageTerm, interestRate, mortgageType);
            displayResults(results);
        } else {
            alert("Por favor, selecione um tipo de hipoteca.");
        }
    }
}

/**
 * Valida os campos de entrada
 * @returns {boolean} 
 */
function validateInputs() {
    let isValid = true;

    isValid = validateField(mortgageAmountInput, mortgageError, "Este campo é obrigatório") && isValid;
    isValid = validateField(interestRateInput, interestError, "Este campo é obrigatório") && isValid;
    isValid = validateField(mortgageTermInput, null, "") && isValid;

    return isValid;
}

/**
 * Valida um campo de entrada específico
 * @param {HTMLInputElement} field 
 * @param {HTMLElement} errorElement 
 * @returns {boolean} 
 */
function validateField(field, errorElement, errorMessage) {
    if (field.value === "") {
        field.classList.add("error");
        if (errorElement) {
            errorElement.style.display = "block";
            errorElement.textContent = errorMessage;
        }
        return false;
    } else {
        field.classList.remove("error");
        if (errorElement) {
            errorElement.style.display = "none";
        }
        return true;
    }
}

/**
 * Calcula os pagamentos da hipoteca
 * @param {number} amount 
 * @param {number} term 
 * @param {number} rate 
 * @param {string} type 
 * @returns {Object} 
 */
function calculateMortgage(amount, term, rate, type) {
    const monthlyRate = rate / 12;
    const numberOfPayments = term * 12;

    let monthlyRepayment;
    if (type === "Repayment") {
        monthlyRepayment = amount * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
            (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
    } else {
        monthlyRepayment = amount * monthlyRate;
    }

    const totalRepayment = type === "Repayment" ? (monthlyRepayment * numberOfPayments) :
        (monthlyRepayment * numberOfPayments + amount);
    const totalInterest = totalRepayment - amount;

    return { monthlyRepayment, totalRepayment, totalInterest };
}

/**
 * Exibe os resultados do cálculo na interface do usuário
 * @param {Object} results
 */
function displayResults(results) {
    monthlyRepaymentsOutput.textContent = formatCurrency(results.monthlyRepayment);
    totalRepaymentsOutput.textContent = formatCurrency(results.totalRepayment);

    preCalculateBlock.style.display = "none";
    postCalculateBlock.style.display = "block";
}

/**
 * Formata um número como moeda
 * @param {number} value 
 * @returns {string}
 */
function formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}

//Reseta o formulário para o estado inicial
function resetForm() {
    mortgageAmountInput.value = "";
    mortgageTermInput.value = "";
    interestRateInput.value = "";
    document.querySelectorAll('input[name="MortgageType"]').forEach(radio => radio.checked = false);
    
    preCalculateBlock.style.display = "block";
    postCalculateBlock.style.display = "none";

    // Limpa as mensagens de erro
    document.querySelectorAll('.error-message').forEach(el => el.style.display = 'none');
    document.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
}