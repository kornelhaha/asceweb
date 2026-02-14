let throwPotState = {
    weaponSlot: 1,
    potionSlots: [false, true, true, false, false, false, false, false, false]
};

const rightClickerState = {
    enabled: false,
    cps: 10.0,
    blatantMode: false,
    holdToClick: true,
    hotkeyCode: 118, // F7
    enableRandomization: false,
    randomizationAmount: 1.0
};

function updateRightCps(value) {
    if (isUpdatingFromServer) return;
    const cps = parseFloat(value);
    rightClickerState.cps = cps;
    document.getElementById('rightclicker-cpsValue').textContent = cps.toFixed(1);
    saveSettings({ rightCps: cps });
}

function updateRightRandomizationAmount(value) {
    if (isUpdatingFromServer) return;
    const amount = parseFloat(value);
    rightClickerState.randomizationAmount = amount;
    document.getElementById('rightclicker-randomizationAmountValue').textContent = amount.toFixed(1);
    saveSettings({ rightRandomizationAmount: amount });
}

function checkLicenseStatus() {
    hasActiveLicense = currentUser.license && currentUser.license.status === 'active';
    updateLicenseRestrictions();
}

function updateLicenseRestrictions() {
    const navItems = document.querySelectorAll('.nav-item[data-requires-license="true"]');
    navItems.forEach(item => {
        if (hasActiveLicense) {
            item.classList.remove('locked');
        } else {
            item.classList.add('locked');
        }
    });

    const modulesContent = document.getElementById('modulesContent');
    const noLicenseMessage = document.getElementById('noLicenseMessage');
    if (hasActiveLicense) {
        modulesContent.style.display = 'block';
        noLicenseMessage.style.display = 'none';
    } else {
        modulesContent.style.display = 'none';
        noLicenseMessage.style.display = 'block';
    }

    const downloadContent = document.getElementById('downloadContent');
    const noLicenseMessageDownload = document.getElementById('noLicenseMessageDownload');
    if (hasActiveLicense) {
        downloadContent.style.display = 'block';
        noLicenseMessageDownload.style.display = 'none';
    } else {
        downloadContent.style.display = 'none';
        noLicenseMessageDownload.style.display = 'block';
    }
}

function updateUserDisplay() {
    const userNameEl = document.getElementById('userName');
    const userAvatarEl = document.getElementById('userAvatar');
    const userLicenseEl = document.getElementById('userLicense');

    if (userNameEl) userNameEl.textContent = currentUser.username || 'User';
    if (userAvatarEl) userAvatarEl.textContent = (currentUser.username || 'U').charAt(0).toUpperCase();

    if (userLicenseEl) {
        if (currentUser.license) {
            const timeRemaining = currentUser.license.timeRemaining || 'Lifetime';
            userLicenseEl.textContent = `${currentUser.license.type} • ${timeRemaining}`;
            userLicenseEl.classList.add('premium');
        } else {
            userLicenseEl.textContent = 'No License';
            userLicenseEl.classList.remove('premium');
        }
    }

    document.getElementById('settingsUsername').textContent = currentUser.username;
    document.getElementById('settingsEmail').textContent = currentUser.email;
    document.getElementById('settingsRole').textContent = currentUser.role;
    document.getElementById('settingsClicks').textContent = (currentUser.totalClicks || 0).toLocaleString();

    updateLicenseDisplay();
}

function updateLicenseDisplay() {
    const licenseBadge = document.getElementById('licenseBadge');
    const licenseExpiry = document.getElementById('licenseExpiry');
    const licenseExpiryRow = document.getElementById('licenseExpiryRow');
    const activationSection = document.getElementById('activationSection');

    if (currentUser.license) {
        licenseBadge.textContent = currentUser.license.type.charAt(0).toUpperCase() + currentUser.license.type.slice(1);
        licenseBadge.className = 'license-badge ' + currentUser.license.type;
        licenseExpiryRow.style.display = 'flex';
        licenseExpiry.textContent = currentUser.license.timeRemaining;
        activationSection.style.display = 'none';
    } else {
        licenseBadge.textContent = 'No License';
        licenseBadge.className = 'license-badge expired';
        licenseExpiryRow.style.display = 'none';
        activationSection.style.display = 'block';
    }
}

function calculateCpsRange(baseCps) {
    const variance = baseCps * 0.125;
    const minCps = Math.max(1, baseCps - variance).toFixed(1);
    const maxCps = Math.min(25, baseCps + variance).toFixed(1);
    return `(${minCps}-${maxCps})`;
}

function applySettings(config) {
    console.log('[APPLY] Applying settings:', config);

    // Left Clicker Module Toggle
    const leftClickerToggle = document.querySelector('.module-toggle-leftclicker');
    if (leftClickerToggle && config.enabled !== undefined) {
        if (config.enabled) {
            leftClickerToggle.classList.add('active');
        } else {
            leftClickerToggle.classList.remove('active');
        }
    }

        if (slider) slider.value = config.rightCps;
        if (value) value.textContent = config.rightCps.toFixed(1);
    }
    
    if (config.rightHotkeyCode !== undefined) {
        rightClickerState.hotkeyCode = config.rightHotkeyCode;
        const input = document.getElementById('rightclicker-hotkeyInput');
        if (input) input.value = getKeyName(config.rightHotkeyCode);
    }
    
    if (config.rightHoldToClick !== undefined) {
        rightClickerState.holdToClick = config.rightHoldToClick;
        const checkbox = document.querySelector('.checkbox-rightclicker-hold');
        if (checkbox) {
            if (config.rightHoldToClick) {
                checkbox.classList.add('checked');
            } else {
                checkbox.classList.remove('checked');
            }
        }
    }
    
    if (config.rightBlatantMode !== undefined) {
        rightClickerState.blatantMode = config.rightBlatantMode;
        const checkbox = document.querySelector('.checkbox-rightclicker-blatant');
        if (checkbox) {
            if (config.rightBlatantMode) {
                checkbox.classList.add('checked');
            } else {
                checkbox.classList.remove('checked');
            }
        }
    }
    
    if (config.rightEnableRandomization !== undefined) {
        rightClickerState.enableRandomization = config.rightEnableRandomization;
        const toggle = document.querySelector('.mini-toggle-rightclicker-randomization');
        if (toggle) {
            if (config.rightEnableRandomization) {
                toggle.classList.add('active');
            } else {
                toggle.classList.remove('active');
            }
        }
    }
    
    if (config.rightRandomizationAmount !== undefined) {
        rightClickerState.randomizationAmount = config.rightRandomizationAmount;
        const slider = document.getElementById('rightclicker-randomizationAmountSlider');
        const value = document.getElementById('rightclicker-randomizationAmountValue');
        if (slider) slider.value = config.rightRandomizationAmount;
        if (value) value.textContent = config.rightRandomizationAmount.toFixed(1);
    }

    // Left Clicker CPS
    if (config.cps !== undefined) {
        const cps = parseFloat(config.cps);
        const cpsValue = document.getElementById('leftclicker-cpsValue');
        const cpsSlider = document.getElementById('leftclicker-cpsSlider');
        const cpsRange = document.getElementById('leftclicker-cpsRange');
        if (cpsValue) cpsValue.textContent = cps.toFixed(1);
        if (cpsSlider) cpsSlider.value = cps;
        if (cpsRange) cpsRange.textContent = calculateCpsRange(cps);
    }

    // Left Clicker Hotkey
    if (config.hotkeyCode !== undefined) {
        const hotkeyInput = document.getElementById('leftclicker-hotkeyInput');
        if (hotkeyInput) hotkeyInput.value = getKeyName(config.hotkeyCode);
    }

    // Left Clicker Hold to Click
    const holdToClick = document.querySelector('.checkbox-leftclicker-hold');
    if (holdToClick && config.holdToClick !== undefined) {
        if (config.holdToClick) {
            holdToClick.classList.add('checked');
        } else {
            holdToClick.classList.remove('checked');
        }
    }

    // Left Clicker Blatant Mode
    const blatantMode = document.querySelector('.checkbox-leftclicker-blatant');
    if (blatantMode && config.blatantMode !== undefined) {
        if (config.blatantMode) {
            blatantMode.classList.add('checked');
        } else {
            blatantMode.classList.remove('checked');
        }
    }

    // Exhaust Mode Toggle
    const exhaustToggle = document.querySelector('.mini-toggle-leftclicker-exhaust');
    if (exhaustToggle && config.exhaustMode !== undefined) {
        if (config.exhaustMode) {
            exhaustToggle.classList.add('active');
        } else {
            exhaustToggle.classList.remove('active');
        }
    }

    // Exhaust Drop CPS
    if (config.exhaustDropCps !== undefined) {
        const drop = parseFloat(config.exhaustDropCps);
        const dropValue = document.getElementById('leftclicker-exhaustDropValue');
        const dropSlider = document.getElementById('leftclicker-exhaustDropSlider');
        if (dropValue) dropValue.textContent = drop.toFixed(1);
        if (dropSlider) dropSlider.value = drop;
    }

    // Exhaust Chance
    if (config.exhaustChance !== undefined) {
        const chance = parseInt(config.exhaustChance);
        const chanceValue = document.getElementById('leftclicker-exhaustChanceValue');
        const chanceSlider = document.getElementById('leftclicker-exhaustChanceSlider');
        if (chanceValue) chanceValue.textContent = chance + '%';
        if (chanceSlider) chanceSlider.value = chance;
    }

    // Spike Mode Toggle
    const spikeToggle = document.querySelector('.mini-toggle-leftclicker-spike');
    if (spikeToggle && config.spikeMode !== undefined) {
        if (config.spikeMode) {
            spikeToggle.classList.add('active');
        } else {
            spikeToggle.classList.remove('active');
        }
    }

    // Spike Increase CPS
    if (config.spikeIncreaseCps !== undefined) {
        const increase = parseFloat(config.spikeIncreaseCps);
        const increaseValue = document.getElementById('leftclicker-spikeIncreaseValue');
        const increaseSlider = document.getElementById('leftclicker-spikeIncreaseSlider');
        if (increaseValue) increaseValue.textContent = increase.toFixed(1);
        if (increaseSlider) increaseSlider.value = increase;
    }

    // Spike Chance
    if (config.spikeChance !== undefined) {
        const chance = parseInt(config.spikeChance);
        const chanceValue = document.getElementById('leftclicker-spikeChanceValue');
        const chanceSlider = document.getElementById('leftclicker-spikeChanceSlider');
        if (chanceValue) chanceValue.textContent = chance + '%';
        if (chanceSlider) chanceSlider.value = chance;
    }

    // Randomization Toggle
    const randomToggle = document.querySelector('.mini-toggle-leftclicker-randomization');
    if (randomToggle && config.enableRandomization !== undefined) {
        if (config.enableRandomization) {
            randomToggle.classList.add('active');
        } else {
            randomToggle.classList.remove('active');
        }
    }

    // Randomization Amount
    if (config.randomizationAmount !== undefined) {
        const amount = parseFloat(config.randomizationAmount);
        const amountValue = document.getElementById('leftclicker-randomizationAmountValue');
        const amountSlider = document.getElementById('leftclicker-randomizationAmountSlider');
        if (amountValue) amountValue.textContent = amount.toFixed(1);
        if (amountSlider) amountSlider.value = amount;
    }

    // Blockhit Module Toggle
    const blockhitToggle = document.querySelector('.module-toggle-blockhit');
    if (blockhitToggle && config.blockhitEnabled !== undefined) {
        if (config.blockhitEnabled) {
            blockhitToggle.classList.add('active');
        } else {
            blockhitToggle.classList.remove('active');
        }
    }

    // Blockhit Block Chance
    if (config.blockChance !== undefined) {
        const chance = parseInt(config.blockChance);
        const chanceValue = document.getElementById('blockhit-blockChanceValue');
        const chanceSlider = document.getElementById('blockhit-blockChanceSlider');
        if (chanceValue) chanceValue.textContent = chance + '%';
        if (chanceSlider) chanceSlider.value = chance;
    }

    // Blockhit Hold Min
    if (config.holdLengthMin !== undefined) {
        const holdMin = parseInt(config.holdLengthMin);
        const minValue = document.getElementById('blockhit-holdMinValue');
        const minSlider = document.getElementById('blockhit-holdMinSlider');
        if (minValue) minValue.textContent = holdMin;
        if (minSlider) minSlider.value = holdMin;
    }

    // Blockhit Hold Max
    if (config.holdLengthMax !== undefined) {
        const holdMax = parseInt(config.holdLengthMax);
        const maxValue = document.getElementById('blockhit-holdMaxValue');
        const maxSlider = document.getElementById('blockhit-holdMaxSlider');
        if (maxValue) maxValue.textContent = holdMax;
        if (maxSlider) maxSlider.value = holdMax;
    }

    // Blockhit Delay Min
    if (config.delayMin !== undefined) {
        const delayMin = parseInt(config.delayMin);
        const minValue = document.getElementById('blockhit-delayMinValue');
        const minSlider = document.getElementById('blockhit-delayMinSlider');
        if (minValue) minValue.textContent = delayMin;
        if (minSlider) minSlider.value = delayMin;
    }

    // Blockhit Delay Max
    if (config.delayMax !== undefined) {
        const delayMax = parseInt(config.delayMax);
        const maxValue = document.getElementById('blockhit-delayMaxValue');
        const maxSlider = document.getElementById('blockhit-delayMaxSlider');
        if (maxValue) maxValue.textContent = delayMax;
        if (maxSlider) maxSlider.value = delayMax;
    }

    // Blockhit Only While Clicking
    const onlyWhileClicking = document.querySelector('.checkbox-blockhit-onlyclick');
    if (onlyWhileClicking && config.onlyWhileClicking !== undefined) {
        if (config.onlyWhileClicking) {
            onlyWhileClicking.classList.add('checked');
        } else {
            onlyWhileClicking.classList.remove('checked');
        }
    }

    // Loader Settings Hide
    const hideLoader = document.querySelector('.checkbox-loadersettings-hide');
    if (hideLoader && config.hideLoader !== undefined) {
        if (config.hideLoader) {
            hideLoader.classList.add('checked');
        } else {
            hideLoader.classList.remove('checked');
        }
    }


function filterCategory(category) {
    document.querySelectorAll('.category-tab').forEach(tab => tab.classList.remove('active'));
    event.currentTarget.classList.add('active');

    const allCards = [
        '.module-card-leftclicker',
        '.module-card-rightclicker',
        '.module-card-blockhit',
        '.module-card-loadersettings',
        '.module-card-configmanager'
    ];

    allCards.forEach(cardClass => {
        const card = document.querySelector(cardClass);
        if (card) {
            const cardCategory = card.getAttribute('data-category');
            if (cardCategory === category) {
                card.classList.add('visible');
            } else {
                card.classList.remove('visible');
            }
        }
    });
}

function updateCps(value) {
    if (isUpdatingFromServer) return;
    const cpsValue = parseFloat(value);
    document.getElementById('leftclicker-cpsValue').textContent = cpsValue.toFixed(1);
    document.getElementById('leftclicker-cpsRange').textContent = calculateCpsRange(cpsValue);
    saveSettings({ cps: cpsValue });
}

function updateExhaustDrop(value) {
    if (isUpdatingFromServer) return;
    document.getElementById('leftclicker-exhaustDropValue').textContent = parseFloat(value).toFixed(1);
    saveSettings({ exhaustDropCps: parseFloat(value) });
}

function updateExhaustChance(value) {
    if (isUpdatingFromServer) return;
    document.getElementById('leftclicker-exhaustChanceValue').textContent = parseInt(value) + '%';
    saveSettings({ exhaustChance: parseInt(value) });
}

function updateSpikeIncrease(value) {
    if (isUpdatingFromServer) return;
    document.getElementById('leftclicker-spikeIncreaseValue').textContent = parseFloat(value).toFixed(1);
    saveSettings({ spikeIncreaseCps: parseFloat(value) });
}

function updateSpikeChance(value) {
    if (isUpdatingFromServer) return;
    document.getElementById('leftclicker-spikeChanceValue').textContent = parseInt(value) + '%';
    saveSettings({ spikeChance: parseInt(value) });
}

function updateRandomizationAmount(value) {
    if (isUpdatingFromServer) return;
    document.getElementById('leftclicker-randomizationAmountValue').textContent = parseFloat(value).toFixed(1);
    saveSettings({ randomizationAmount: parseFloat(value) });
}

function updateBlockChance(value) {
    if (isUpdatingFromServer) return;
    document.getElementById('blockhit-blockChanceValue').textContent = parseInt(value) + '%';
    saveSettings({ blockChance: parseInt(value) });
}

function updateHoldMin(value) {
    if (isUpdatingFromServer) return;
    const holdValue = parseInt(value);
    document.getElementById('blockhit-holdMinValue').textContent = holdValue;
    
    const maxSlider = document.getElementById('blockhit-holdMaxSlider');
    if (holdValue > parseInt(maxSlider.value)) {
        maxSlider.value = holdValue;
        document.getElementById('blockhit-holdMaxValue').textContent = holdValue;
        saveSettings({ holdLengthMin: holdValue, holdLengthMax: holdValue });
    } else {
        saveSettings({ holdLengthMin: holdValue });
    }
}

function updateHoldMax(value) {
    if (isUpdatingFromServer) return;
    const holdValue = parseInt(value);
    document.getElementById('blockhit-holdMaxValue').textContent = holdValue;
    
    const minSlider = document.getElementById('blockhit-holdMinSlider');
    if (holdValue < parseInt(minSlider.value)) {
        minSlider.value = holdValue;
        document.getElementById('blockhit-holdMinValue').textContent = holdValue;
        saveSettings({ holdLengthMin: holdValue, holdLengthMax: holdValue });
    } else {
        saveSettings({ holdLengthMax: holdValue });
    }
}

function updateDelayMin(value) {
    if (isUpdatingFromServer) return;
    const delayValue = parseInt(value);
    document.getElementById('blockhit-delayMinValue').textContent = delayValue;
    
    const maxSlider = document.getElementById('blockhit-delayMaxSlider');
    if (delayValue > parseInt(maxSlider.value)) {
        maxSlider.value = delayValue;
        document.getElementById('blockhit-delayMaxValue').textContent = delayValue;
        saveSettings({ delayMin: delayValue, delayMax: delayValue });
    } else {
        saveSettings({ delayMin: delayValue });
    }
}

function updateDelayMax(value) {
    if (isUpdatingFromServer) return;
    const delayValue = parseInt(value);
    document.getElementById('blockhit-delayMaxValue').textContent = delayValue;
    
    const minSlider = document.getElementById('blockhit-delayMinSlider');
    if (delayValue < parseInt(minSlider.value)) {
        minSlider.value = delayValue;
        document.getElementById('blockhit-delayMinValue').textContent = delayValue;
        saveSettings({ delayMin: delayValue, delayMax: delayValue });
    } else {
        saveSettings({ delayMax: delayValue });
    }
}

function updateSlotSwitchDelay(value) {
    if (isUpdatingFromServer) return;
    document.getElementById('throwpot-slotSwitchDelayValue').textContent = parseInt(value);
    saveSettings({ throwPotSlotDelay: parseInt(value) });
}

function updateThrowDelay(value) {
    if (isUpdatingFromServer) return;
    document.getElementById('throwpot-throwDelayValue').textContent = parseInt(value);
    saveSettings({ throwPotThrowDelay: parseInt(value) });
}

function updateReturnDelay(value) {
    if (isUpdatingFromServer) return;
    document.getElementById('throwpot-returnDelayValue').textContent = parseInt(value);
    saveSettings({ throwPotReturnDelay: parseInt(value) });
}

function selectWeaponSlot(slot) {
    if (isUpdatingFromServer) return;
    
    // Remove selection from all weapon slots
    document.querySelectorAll('.slot-checkbox-throwpot-weapon').forEach(el => {
        el.classList.remove('selected');
    });
    
    // Add selection to clicked slot
    const slotEl = document.querySelector(`.slot-checkbox-throwpot-weapon[data-slot="${slot}"]`);
    if (slotEl) {
        slotEl.classList.add('selected');
    }
    
    throwPotState.weaponSlot = slot;
    saveSettings({ throwPotWeaponSlot: slot });
}

function togglePotionSlot(slot) {
    if (isUpdatingFromServer) return;
    
    const index = slot - 1;
    throwPotState.potionSlots[index] = !throwPotState.potionSlots[index];
    
    const checkbox = document.querySelector(`.checkbox-throwpot-potion-${slot}`);
    if (checkbox) {
        if (throwPotState.potionSlots[index]) {
            checkbox.classList.add('checked');
        } else {
            checkbox.classList.remove('checked');
        }
    }
    
    const slotsString = throwPotState.potionSlots.map(s => s ? '1' : '0').join('');
    saveSettings({ throwPotSlots: slotsString });
}

const originalToggleModule = toggleModule;
function toggleModule(moduleName) {
    if (isUpdatingFromServer) return;
    
    // Define specific toggle selectors for each module
    const toggleMap = {
        'leftclicker': '.module-toggle-leftclicker',
        'blockhit': '.module-toggle-blockhit',
        'throwpot': '.module-toggle-throwpot'
    };
    
    const toggle = document.querySelector(toggleMap[moduleName]);
    if (!toggle) return;
    
    toggle.classList.toggle('active');
    const isActive = toggle.classList.contains('active');
    
    if (moduleName === 'leftclicker') {
        saveSettings({ enabled: isActive });
    } else if (moduleName === 'blockhit') {
        saveSettings({ blockhitEnabled: isActive });
    } else if (moduleName === 'throwpot') {
        saveSettings({ throwPotEnabled: isActive });
    }

    if (module === 'rightclicker') {
        if (isUpdatingFromServer) return;
        const toggle = document.querySelector('.module-toggle-rightclicker');
        const isEnabled = toggle.classList.contains('active');
        
        if (isEnabled) {
            toggle.classList.remove('active');
            rightClickerState.enabled = false;
        } else {
            toggle.classList.add('active');
            rightClickerState.enabled = true;
        }
        
        saveSettings({ rightEnabled: rightClickerState.enabled });
    } else {
        originalToggleModule(module);
    }
}

function toggleModuleSettings(moduleName) {
    // Define specific settings and button selectors for each module
    const settingsMap = {
        'leftclicker': '.module-settings-leftclicker',
        'blockhit': '.module-settings-blockhit',
        'rightclicker': '.module-settings-rightclicker',
        'configmanager': '.module-settings-configmanager'
    };
    
    const btnMap = {
        'leftclicker': '.expand-btn-leftclicker',
        'blockhit': '.expand-btn-blockhit',
        'rightclicker': '.expand-btn-rightclicker',
        'configmanager': '.expand-btn-configmanager'
    };
    
    const settings = document.querySelector(settingsMap[moduleName]);
    const btn = document.querySelector(btnMap[moduleName]);
    
    if (settings && btn) {
        const isOpen = settings.classList.contains('show');
        
        if (isOpen) {
            btn.classList.remove('expanded');
            settings.classList.remove('show');
        } else {
            btn.classList.add('expanded');
            settings.classList.add('show');
        }
    }
}

const originalToggleMiniSetting = toggleMiniSetting;
function toggleMiniSetting(element, settingName) {
    if (isUpdatingFromServer) return;
    element.classList.toggle('active');
    saveSettings({ [settingName]: element.classList.contains('active') });

    if (setting === 'rightEnableRandomization') {
        if (isUpdatingFromServer) return;
        const isActive = element.classList.contains('active');
        
        if (isActive) {
            element.classList.remove('active');
            rightClickerState.enableRandomization = false;
        } else {
            element.classList.add('active');
            rightClickerState.enableRandomization = true;
        }
        
        saveSettings({ rightEnableRandomization: rightClickerState.enableRandomization });
    } else {
        originalToggleMiniSetting(element, setting);
    }
}

const originalToggleCheckbox = toggleCheckbox;
function toggleCheckbox(element, settingName) {
    if (isUpdatingFromServer) return;
    element.classList.toggle('checked');
    saveSettings({ [settingName]: element.classList.contains('checked') });

    if (setting === 'rightHoldToClick' || setting === 'rightBlatantMode') {
        if (isUpdatingFromServer) return;
        const isChecked = element.classList.contains('checked');
        
        if (isChecked) {
            element.classList.remove('checked');
        } else {
            element.classList.add('checked');
        }
        
        const newValue = !isChecked;
        
        if (setting === 'rightHoldToClick') {
            rightClickerState.holdToClick = newValue;
            saveSettings({ rightHoldToClick: newValue });
        } else if (setting === 'rightBlatantMode') {
            rightClickerState.blatantMode = newValue;
            saveSettings({ rightBlatantMode: newValue });
        }
    } else {
        originalToggleCheckbox(element, setting);
    }
}

function recordKeybind(input, moduleName) {
    if (!input) return;
    
    input.classList.add('recording');
    input.value = 'Press any key...';
    
    const handler = (e) => {
        e.preventDefault();
        input.value = getKeyName(e.keyCode);
        input.classList.remove('recording');
        
        if (moduleName === 'throwpot') {
            saveSettings({ throwPotHotkey: e.keyCode });
        } else {
            saveSettings({ hotkeyCode: e.keyCode });
        }
        
        document.removeEventListener('keydown', handler);
    };
    
    document.addEventListener('keydown', handler);
}

function getKeyName(keyCode) {
    const keyMap = {
        112: 'F1', 113: 'F2', 114: 'F3', 115: 'F4',
        116: 'F5', 117: 'F6', 118: 'F7', 119: 'F8',
        120: 'F9', 121: 'F10', 122: 'F11', 123: 'F12',
        16: 'SHIFT', 17: 'CTRL', 18: 'ALT', 20: 'CAPS',
        32: 'SPACE', 13: 'ENTER', 8: 'BACKSPACE', 9: 'TAB',
        82: 'R'
    };
    return keyMap[keyCode] || String.fromCharCode(keyCode).toUpperCase();
}

function switchSection(event, section) {
    if (!event) return;
    event.preventDefault();
    
    const navItem = event.currentTarget;
    if (navItem && navItem.classList.contains('locked')) {
        alert('This section requires an active license.');
        section = 'settings';
    }
    
    document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
    const targetNav = document.querySelector(`.nav-item[data-section="${section}"]`);
    if (targetNav) targetNav.classList.add('active');
    
    document.querySelectorAll('.content-section').forEach(s => s.classList.remove('active'));
    const sectionEl = document.getElementById(section + '-section');
    if (sectionEl) sectionEl.classList.add('active');
    
    const titles = {
        'modules': { text: 'Modules', icon: 'fa-th-large' },
        'settings': { text: 'Settings', icon: 'fa-cog' },
        'download': { text: 'Download', icon: 'fa-download' }
    };
    
    if (titles[section]) {
        document.getElementById('pageTitle').textContent = titles[section].text;
        document.getElementById('pageTitleIcon').className = 'fas ' + titles[section].icon;
    }
}

function switchSettingsTab(tabName) {
    document.querySelectorAll('.settings-tab').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.settings-tab-content').forEach(content => content.classList.remove('active'));
    
    event.currentTarget.classList.add('active');
    
    const tabContent = document.getElementById(`${tabName}-tab`);
    if (tabContent) tabContent.classList.add('active');
}

let throwPotKeybinds = {
    weapon: [0x31, 0x32, 0x33, 0x34, 0x35, 0x36, 0x37, 0x38, 0x39], // Default 1-9
    potion: [0x31, 0x32, 0x33, 0x34, 0x35, 0x36, 0x37, 0x38, 0x39]  // Default 1-9
};

function setWeaponKeybind() {
    const selectedSlot = throwPotState.weaponSlot;
    if (!selectedSlot) {
        alert('Please select a weapon slot first');
        return;
    }
    
    const slotIndex = selectedSlot - 1;
    const keyDisplay = document.getElementById(`weaponKey${selectedSlot}`);
    
    keyDisplay.textContent = 'Press key...';
    keyDisplay.style.color = '#0f0';
    
    const handler = (e) => {
        e.preventDefault();
        const keyCode = e.keyCode;
        const keyName = getKeyName(keyCode);
        
        // Update display
        keyDisplay.textContent = keyName;
        keyDisplay.style.color = '#fff';
        
        // Update state
        throwPotKeybinds.weapon[slotIndex] = keyCode;
        
        // Save to server
        saveSettings({
            throwPotWeaponKeybinds: JSON.stringify(throwPotKeybinds.weapon)
        });
        
        document.removeEventListener('keydown', handler);
    };
    
    document.addEventListener('keydown', handler);
}

function setPotionKeybind() {
    // Get all checked potion slots
    const checkedSlots = [];
    for (let i = 1; i <= 9; i++) {
        if (throwPotState.potionSlots[i - 1]) {
            checkedSlots.push(i);
        }
    }
    
    if (checkedSlots.length === 0) {
        alert('Please enable at least one potion slot first');
        return;
    }
    
    let currentSlotIndex = 0;
    
    function recordNextSlot() {
        if (currentSlotIndex >= checkedSlots.length) {
            // All done
            saveSettings({
                throwPotPotionKeybinds: JSON.stringify(throwPotKeybinds.potion)
            });
            return;
        }
        
        const slotNumber = checkedSlots[currentSlotIndex];
        const slotIndex = slotNumber - 1;
        const keyDisplay = document.getElementById(`potionKey${slotNumber}`);
        
        keyDisplay.textContent = 'Press...';
        keyDisplay.style.color = '#0f0';
        
        const handler = (e) => {
            e.preventDefault();
            const keyCode = e.keyCode;
            const keyName = getKeyName(keyCode);
            
            // Update display
            keyDisplay.textContent = keyName;
            keyDisplay.style.color = '#fff';
            
            // Update state
            throwPotKeybinds.potion[slotIndex] = keyCode;
            
            document.removeEventListener('keydown', handler);
            
            currentSlotIndex++;
            setTimeout(recordNextSlot, 300);
        };
        
        document.addEventListener('keydown', handler);
    }
    
    recordNextSlot();
}

// Update selectWeaponSlot to show current keybind
function selectWeaponSlot(slot) {
    if (isUpdatingFromServer) return;
    
    document.querySelectorAll('.slot-checkbox-throwpot-weapon').forEach(el => {
        el.classList.remove('selected');
    });
    
    const slotEl = document.querySelector(`.slot-checkbox-throwpot-weapon[data-slot="${slot}"]`);
    if (slotEl) {
        slotEl.classList.add('selected');
    }
    
    throwPotState.weaponSlot = slot;
    saveSettings({ throwPotWeaponSlot: slot });
}

async function loadConfigs() {
    try {
        const response = await fetch(`${API_URL}/api/configs`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        
        if (!response.ok) return;
        
        const configs = await response.json();
        displayConfigs(configs);
    } catch (error) {
        console.error('[CONFIGS] Load error:', error);
    }
}

function displayConfigs(configs) {
    const configsList = document.getElementById('configsList');
    const noConfigsMsg = document.getElementById('noConfigsMessage');
    
    if (!configs || configs.length === 0) {
        configsList.style.display = 'none';
        noConfigsMsg.style.display = 'block';
        return;
    }
    
    configsList.style.display = 'block';
    noConfigsMsg.style.display = 'none';
    
    configsList.innerHTML = configs.map(config => `
        <div class="config-item" data-id="${config._id}">
            <div class="config-header">
                <div class="config-name">
                    <i class="fas fa-file"></i>
                    <span>${config.name}</span>
                </div>
                <div class="config-actions">
                    <button class="btn-small" onclick="loadConfig('${config._id}')" title="Load">
                        <i class="fas fa-upload"></i>
                    </button>
                    <button class="btn-small" onclick="deleteConfig('${config._id}')" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            <div class="config-date">${new Date(config.createdAt).toLocaleDateString()}</div>
        </div>
    `).join('');
}

async function saveNewConfig() {
    const nameInput = document.getElementById('newConfigName');
    const name = nameInput.value.trim();
    
    if (!name) {
        alert('Please enter a config name');
        return;
    }
    
    // Get current settings
    const currentSettings = {
        // Left Clicker
        leftEnabled: clickerState.enabled,
        leftCps: clickerState.cps,
        leftBlatantMode: clickerState.blatantMode,
        leftHoldToClick: clickerState.holdToClick,
        leftHotkeyCode: clickerState.hotkeyCode,
        leftEnableRandomization: clickerState.enableRandomization,
        leftRandomizationAmount: clickerState.randomizationAmount,
        
        // Right Clicker
        rightEnabled: rightClickerState.enabled,
        rightCps: rightClickerState.cps,
        rightBlatantMode: rightClickerState.blatantMode,
        rightHoldToClick: rightClickerState.holdToClick,
        rightHotkeyCode: rightClickerState.hotkeyCode,
        rightEnableRandomization: rightClickerState.enableRandomization,
        rightRandomizationAmount: rightClickerState.randomizationAmount,
        
        // Blockhit
        blockhitEnabled: blockhitState.enabled,
        blockChance: blockhitState.blockChance,
        holdLengthMin: blockhitState.holdLengthMin,
        holdLengthMax: blockhitState.holdLengthMax,
        delayMin: blockhitState.delayMin,
        delayMax: blockhitState.delayMax,
        onlyWhileClicking: blockhitState.onlyWhileClicking
    };
    
    try {
        const response = await fetch(`${API_URL}/api/configs`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
                name: name,
                settings: currentSettings
            })
        });
        
        if (!response.ok) {
            alert('Failed to save config');
            return;
        }
        
        // Show success message
        const successMsg = document.getElementById('configSaveSuccess');
        successMsg.style.display = 'block';
        setTimeout(() => successMsg.style.display = 'none', 3000);
        
        // Clear input
        nameInput.value = '';
        
        // Reload configs list
        loadConfigs();
        
    } catch (error) {
        console.error('[CONFIGS] Save error:', error);
        alert('Failed to save config');
    }
}

async function loadConfig(configId) {
    if (!confirm('Load this config? Current settings will be overwritten.')) {
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/api/configs`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        
        if (!response.ok) return;
        
        const configs = await response.json();
        const config = configs.find(c => c._id === configId);
        
        if (!config) return;
        
        // Apply all settings
        const settings = config.settings;
        
        // Save to server (which will sync to C++ client)
        await saveSettings(settings);
        
        // Apply to UI
        applySettings(settings);
        
        alert('Config loaded successfully!');
        
    } catch (error) {
        console.error('[CONFIGS] Load error:', error);
        alert('Failed to load config');
    }
}

async function deleteConfig(configId) {
    if (!confirm('Delete this config? This cannot be undone.')) {
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/api/configs/${configId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        
        if (!response.ok) {
            alert('Failed to delete config');
            return;
        }
        
        // Reload configs list
        loadConfigs();
        
    } catch (error) {
        console.error('[CONFIGS] Delete error:', error);
        alert('Failed to delete config');
    }
}

function toggleModuleSettings(moduleName) {
    // Define specific settings and button selectors for each module
    const settingsMap = {
        'leftclicker': '.module-settings-leftclicker',
        'blockhit': '.module-settings-blockhit',
        'rightclicker': '.module-settings-rightclicker',
        'configmanager': '.module-settings-configmanager'
    };
    
    const btnMap = {
        'leftclicker': '.expand-btn-leftclicker',
        'blockhit': '.expand-btn-blockhit',
        'rightclicker': '.expand-btn-rightclicker',
        'configmanager': '.expand-btn-configmanager'
    };
    
    const settings = document.querySelector(settingsMap[moduleName]);
    const btn = document.querySelector(btnMap[moduleName]);
    
    if (settings && btn) {
        const isOpen = settings.classList.contains('show');
        
        if (isOpen) {
            btn.classList.remove('expanded');
            settings.classList.remove('show');
        } else {
            btn.classList.add('expanded');
            settings.classList.add('show');
            
            // Load configs when opening configmanager
            if (moduleName === 'configmanager') {
                loadConfigs();
            }
        }
    }
}
