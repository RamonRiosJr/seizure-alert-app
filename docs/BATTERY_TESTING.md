# Battery Testing Guide

This document provides guidelines for testing battery impact and drain rates for the Aura Speaks AI seizure alert application.

## Test Scenarios

### 1. Baseline (App Idle, Screen Off)

**Configuration:**

- App running in background
- Screen off
- No active features (BLE disconnected, Wake Lock off)

**Expected Drain**: ~1-2% per hour (normal background app behavior)

**How to Test:**

1. Close all other apps
2. Disable BLE and Wake Lock in Settings
3. Let app run in background for 1 hour
4. Record battery % before and after

---

### 2. Wake Lock Only (Screen Prevented from Sleeping)

**Configuration:**

- App in foreground or background
- Wake Lock enabled (Prevent Sleep: ON)
- Screen stays on
- BLE disconnected

**Expected Drain**: ~5-8% per hour (screen is the primary drain)

**How to Test:**

1. Enable "Prevent Sleep" in Settings → Battery & Power
2. Disable BLE
3. Let app run for 1 hour
4. Record battery % before and after

---

### 3. BLE Only (Heart Rate Monitor Connected)

**Configuration:**

- BLE heart rate monitor connected
- Wake Lock disabled
- Screen can sleep normally

**Expected Drain**: ~3-5% per hour (BLE radio active)

**How to Test:**

1. Connect BLE heart rate monitor
2. Disable Wake Lock
3. Let app run in background for 1 hour
4. Record battery % before and after

---

### 4. Wake Lock + BLE (Worst Case)

**Configuration:**

- Wake Lock enabled
- BLE heart rate monitor connected
- All features active

**Expected Drain**: ~8-12% per hour (combined drain)

**How to Test:**

1. Enable "Prevent Sleep" in Settings
2. Connect BLE heart rate monitor
3. Let app run for 1 hour
4. Record battery % before and after

---

### 5. Low Power Mode (Optimized)

**Configuration:**

- Low Power Mode enabled
- Wake Lock disabled
- BLE may be connected

**Expected Drain**: ~2-4% per hour (optimized for battery life)

**How to Test:**

1. Enable "Low Power Mode" in Settings → Battery & Power
2. Disable Wake Lock
3. Optionally connect BLE
4. Let app run for 1 hour
5. Record battery % before and after

---

## How to Measure Battery Impact

### Using the App's Built-in Discharge Rate

1. Open the app and navigate to Settings → Battery & Power
2. Let the app run for at least 5-10 minutes to collect data
3. Check the "Discharge Rate" metric (e.g., "-12% per hour")
4. This is calculated based on actual battery level changes over time

### Using Device Battery Settings

1. Go to device Settings → Battery
2. Check "Battery Usage" or "Battery Health"
3. Look for "Aura Speaks AI" in the list
4. Note the % of battery used over the last 24 hours

### Manual Calculation

1. Record starting battery %: `Start%`
2. Note the time: `StartTime`
3. Let app run for a known duration (e.g., 1 hour)
4. Record ending battery %: `End%`
5. Note the time: `EndTime`
6. Calculate: `DrainRate = (End% - Start%) / (EndTime - StartTime in hours)`

**Example:**

- Start: 85% at 10:00 AM
- End: 73% at 11:00 AM
- Drain: (73 - 85) / 1 = **-12% per hour**

---

## Troubleshooting High Battery Drain

### If drain is higher than expected

1. **Check Wake Lock Status**:
   - Settings → Battery & Power → Prevent Sleep
   - If ON, screen will not sleep (high drain)
   - Disable if not needed

2. **Check BLE Connection**:
   - Settings → Device Manager
   - If heart rate monitor is connected, BLE radio is active
   - Disconnect if not actively monitoring

3. **Enable Low Power Mode**:
   - Settings → Battery & Power → Low Power Mode
   - Reduces CPU usage and background activity

4. **Check Background Refresh**:
   - Device Settings → Aura Speaks AI → Background App Refresh
   - Ensure it's enabled for alerts but not causing excessive wake-ups

5. **Check for App Updates**:
   - Newer versions may have battery optimizations
   - Update to the latest version

---

## Battery Health Tips

### To Extend Battery Life

- ✅ Enable Low Power Mode when not actively monitoring
- ✅ Disable Wake Lock when phone is in your pocket
- ✅ Disconnect BLE heart rate monitor when not needed
- ✅ Keep screen brightness low
- ✅ Close other battery-intensive apps

### When to Charge

- ⚠️ Below 20%: Consider charging soon
- 🔴 Below 10%: Charge immediately to ensure alerts work

### Expected Battery Life

- **With Wake Lock + BLE**: ~8-10 hours
- **With BLE Only**: ~15-20 hours
- **Idle (no active features)**: ~2-3 days

---

## Reporting Battery Issues

If you experience unexpected battery drain:

1. **Collect Data**:
   - Screenshot of Settings → Battery & Power section
   - Note the discharge rate
   - List active features (Wake Lock, BLE, etc.)

2. **Check App Version**:
   - Settings → About → Version

3. **Report Issue**:
   - GitHub Issues: <https://github.com/RamonRiosJr/seizure-alert-app/issues>
   - Include: Device model, OS version, app version, drain rate, active features

---

## Testing Checklist

Before releasing a new version, test all scenarios:

- [ ] Baseline (idle) - Record drain rate
- [ ] Wake Lock only - Record drain rate
- [ ] BLE only - Record drain rate
- [ ] Wake Lock + BLE - Record drain rate
- [ ] Low Power Mode - Record drain rate
- [ ] Verify discharge rate calculation is accurate
- [ ] Verify estimated time remaining is reasonable
- [ ] Test on multiple devices (iOS, Android)
- [ ] Document findings in release notes

---

## Notes

- Battery drain varies by device model, OS version, and screen size
- These are **estimated** drain rates based on typical usage
- Actual drain may be higher or lower depending on device and usage patterns
- The app's built-in discharge rate is calculated over the last hour of usage
- For most accurate results, test on a real device (not simulator)
