import { Product } from "./types";

export function getSampleProducts(): Product[] {
  const products: Product[] = [
    {
      id: "prod_1",
      name: "SafeGuard+",
      category: "safety",
      price: 9999,
      salePrice: 2999,
      stock: 10,
      description:
        "Safeguard+ is a compact women’s safety device with SOS alerts, GPS sharing, electric shock defense, and 5000mAh powerbank.",
      image: "/images/safeguard.jpeg",
      keyFeatures: [
        "SOS Alerts with GPS Location",
        "Electric Shock Defense",
        "5000mAh Powerbank",
        "Compact & Stylish Design",
      ],
      specifications: {
        "Battery Capacity": "5000mAh",
        "Charging Time": "2 hours",
        "Teaser": "220 V (AC)",
        "Weight": "50g",
      },
      packageContents: ["SafeGuard+ Device", "Charging Cable", "User Manual"],
      featured: true,
      onSale: true,
      createdAt: new Date().toISOString(),
    },


    {
      id: "prod_2",
      name: "NovaGuard",
      category: "safety",
      price: 999,
      stock: 5,
      description:
      "NovaGuard is an all-in-one smart security stick delivering signaling, illumination, non-lethal defense, laser guidance, and long-lasting power backup.",
      image: "/images/nova.jpeg",
      keyFeatures: [
    "All-in-one smart security stick",
    "Red & green signal lights",
    "High-power torch",
    "Non-lethal electric shock defense",
    "Laser pointer for direction control"
      ],
      specifications: {
        "Battery Capacity": "5000mAh",
        "Charging Time": "3 hours",
        "Teaser": "100V (AC)",
        "Weight": "500g",
      },
      packageContents: ["NovaGuard Device", "Charging Cable", "User Manual", "Carrying Case"],

      featured: true,
      onSale: false,
      createdAt: new Date().toISOString(),
    },
    
  ]
  return products;
}

/*function getSampleProjects(): Project[] {
  return [
    {
      id: "proj_1",
      name: "Smart Home Automation System",
      category: "smart-home",
      price: 199999,
      salePrice: 159999,
      description:
        "Complete home automation solution with voice control, mobile app, and central hub. Control lights, fans, AC, and appliances remotely.",
      image: "https://raw.githubusercontent.com/varundve/assets/refs/heads/master/images/smart-home-automation-dashboard-with-devices.jpg",
      features: ["Voice Control (Alexa/Google)", "Mobile App", "Energy Monitoring", "Scene Automation"],
      components: "Arduino, ESP32, Relay Modules, Sensors, Custom PCB",
      deliveryTime: "7-10 days",
      featured: true,
      onSale: true,
      rating: 4.8,
      reviews: 124,
      stock: 15,
    },
    {
      id: "proj_2",
      name: "Industrial Temperature Monitoring",
      category: "industrial",
      price: 329999,
      description:
        "Multi-point temperature monitoring system for industrial environments with cloud dashboard, alerts, and data logging.",
      image: "https://raw.githubusercontent.com/varundve/assets/refs/heads/master/images/industrial-temperature-monitoring-dashboard-sensor.jpg",
      features: ["16-Point Monitoring", "Cloud Dashboard", "SMS/Email Alerts", "Historical Data"],
      components: "Industrial Sensors, PLC, HMI Display, Gateway",
      deliveryTime: "10-14 days",
      featured: true,
      onSale: false,
      rating: 4.9,
      reviews: 89,
      stock: 8,
    },
    {
      id: "proj_3",
      name: "Smart Agriculture Kit",
      category: "agriculture",
      price: 149999,
      salePrice: 124999,
      description:
        "Automated irrigation and crop monitoring system. Monitors soil moisture, temperature, humidity, and controls water pumps automatically.",
      image: "https://raw.githubusercontent.com/varundve/assets/refs/heads/master/images/smart-agriculture-iot-sensors-in-farm-field.jpg",
      features: ["Auto Irrigation", "Soil Monitoring", "Weather Integration", "Mobile Alerts"],
      components: "Soil Sensors, Weather Station, Pump Controller, Solar Panel",
      deliveryTime: "5-7 days",
      featured: false,
      onSale: true,
      rating: 4.7,
      reviews: 67,
      stock: 20,
    },
    {
      id: "proj_4",
      name: "Patient Health Monitor",
      category: "healthcare",
      price: 374999,
      description:
        "Continuous patient monitoring system for hospitals and home care. Tracks vital signs with real-time alerts to doctors.",
      image: "https://raw.githubusercontent.com/varundve/assets/refs/heads/master/images/patient-health-monitoring-device-medical-iot.jpg",
      features: ["ECG Monitoring", "SpO2 & Heart Rate", "Cloud Connectivity", "Doctor Dashboard"],
      components: "Medical Sensors, ESP32, Display Unit, Cloud Platform",
      deliveryTime: "14-21 days",
      featured: true,
      onSale: false,
      rating: 4.9,
      reviews: 45,
      stock: 5,
    },
    {
      id: "proj_5",
      name: "Smart Security System",
      category: "security",
      price: 249999,
      salePrice: 199999,
      description:
        "Complete security solution with motion detection, door sensors, cameras, and mobile app for real-time monitoring and alerts.",
      image: "https://raw.githubusercontent.com/varundve/assets/refs/heads/master/images/smart-home-security-system-with-camera-sensors.jpg",
      features: ["Motion Detection", "Door/Window Sensors", "Camera Integration", "24/7 Monitoring"],
      components: "PIR Sensors, Magnetic Sensors, IP Camera, Central Hub",
      deliveryTime: "7-10 days",
      featured: false,
      onSale: true,
      rating: 4.6,
      reviews: 98,
      stock: 12,
    },
    {
      id: "proj_6",
      name: "Smart Energy Meter System",
      category: "industrial",
      price: 189999,
      salePrice: 149999,
      description:
        "Industrial energy monitoring with multi-point metering, power quality analysis, and automated billing integration.",
      image: "https://raw.githubusercontent.com/varundve/assets/refs/heads/master/images/smart-energy-meter-industrial-power-monitoring.jpg",
      features: ["Multi-Point Metering", "Power Analysis", "Billing Integration", "Load Management"],
      components: "CT Sensors, Energy IC, Gateway, Cloud Platform",
      deliveryTime: "10-14 days",
      featured: false,
      onSale: true,
      rating: 4.7,
      reviews: 56,
      stock: 18,
    },
    {
      id: "proj_7",
      name: "Water Quality Monitor",
      category: "agriculture",
      price: 129999,
      description:
        "Real-time water quality monitoring for aquaculture and water treatment. Measures pH, TDS, DO, and temperature.",
      image: "https://raw.githubusercontent.com/varundve/assets/refs/heads/master/images/water-quality-monitoring-sensor-iot.jpg",
      features: ["pH Monitoring", "TDS & Conductivity", "Dissolved Oxygen", "Remote Alerts"],
      components: "Water Sensors, Waterproof Housing, Solar Power, Gateway",
      deliveryTime: "7-10 days",
      featured: false,
      onSale: false,
      rating: 4.5,
      reviews: 34,
      stock: 25,
    },
    {
      id: "proj_8",
      name: "Vehicle Tracking System",
      category: "security",
      price: 89999,
      description:
        "GPS-based vehicle tracking with real-time location, route history, geofencing, and driver behavior monitoring.",
      image: "https://raw.githubusercontent.com/varundve/assets/refs/heads/master/images/gpss.png",
      features: ["Real-time Tracking", "Geofencing", "Route History", "Driver Alerts"],
      components: "GPS Module, GSM Module, OBD Interface, Cloud Platform",
      deliveryTime: "3-5 days",
      featured: false,
      onSale: false,
      rating: 4.6,
      reviews: 112,
      stock: 40,
    },
  ]
}
  */
