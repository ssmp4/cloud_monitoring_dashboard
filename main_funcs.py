import math

DATA = {
    "months": ["Месяц 1", "Месяц 2", "Месяц 3"],
    "uptime_hours": 2160,
    "hardware_failures": [6, 4, 3],
    "software_failures": [12, 8, 5],
    "network_failures": [18, 15, 10],
    "downtime_per_incident_min": [15, 12, 8],
    "response_time_ms": [450, 420, 380],
}


def calculate_metrics():
    total_failures = [
        hw + sw + net
        for hw, sw, net in zip(DATA["hardware_failures"], DATA["software_failures"], DATA["network_failures"])
    ]

    total_downtime_hours = [
        (failures * downtime_min) / 60
        for failures, downtime_min in zip(total_failures, DATA["downtime_per_incident_min"])
    ]

    availability = [
        (DATA["uptime_hours"] - dt) / DATA["uptime_hours"]
        for dt in total_downtime_hours
    ]

    qos = [
        avail * (1 - rt / 1000) * 100
        for avail, rt in zip(availability, DATA["response_time_ms"])
    ]

    mtbf_hours = [
        DATA["uptime_hours"] / failures if failures > 0 else 0
        for failures in total_failures
    ]

    # Индекс стабильности по типам
    stability = {
        "hardware": [1 - DATA["hardware_failures"][i]/total_failures[i] if total_failures[i] > 0 else 1 for i in range(3)],
        "software": [1 - DATA["software_failures"][i]/total_failures[i] if total_failures[i] > 0 else 1 for i in range(3)],
        "network": [1 - DATA["network_failures"][i]/total_failures[i] if total_failures[i] > 0 else 1 for i in range(3)],
    }

    def float_or_zero(value):
        try:
            if isinstance(value, (int, float)):
                if math.isfinite(value):
                    return float(value)
            return 0.0
        except:
            return 0.0

    return {
        "months": DATA["months"],
        "total_failures": total_failures,
        "availability": [float_or_zero(a) for a in availability],
        "response_time_ms": [float_or_zero(rt) for rt in DATA["response_time_ms"]],
        "qos": [float_or_zero(q) for q in qos],
        "mtbf_hours": [float_or_zero(mt) for mt in mtbf_hours],
        "stability": {
            k: [float_or_zero(vv) for vv in v]
            for k, v in stability.items()
        },
    }

