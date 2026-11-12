import uuid

import pytest


def unique_code():
    return f"DEP-{uuid.uuid4().hex[:8].upper()}"


@pytest.mark.asyncio
async def test_create_department(client):

    code = unique_code()

    response = await client.post(
        "/api/v1/institution/departments",
        json={
            "code": code,
            "name": "Computer Science and Engineering",
        },
    )

    assert response.status_code == 201

    data = response.json()

    assert data["code"] == code
    assert data["name"] == "Computer Science and Engineering"
    assert data["is_active"] is True
    assert "id" in data


@pytest.mark.asyncio
async def test_duplicate_department_code(client):

    code = unique_code()

    payload = {
        "code": code,
        "name": "Computer Science",
    }

    first = await client.post(
        "/api/v1/institution/departments",
        json=payload,
    )

    assert first.status_code == 201

    second = await client.post(
        "/api/v1/institution/departments",
        json={
            "code": code,
            "name": "Another Department",
        },
    )

    assert second.status_code == 409
    assert (
        second.json()["detail"]["code"]
        == "DEPARTMENT_CODE_EXISTS"
    )


@pytest.mark.asyncio
async def test_invalid_department_data(client):

    response = await client.post(
        "/api/v1/institution/departments",
        json={
            "code": "",
            "name": "",
        },
    )

    assert response.status_code == 422


@pytest.mark.asyncio
async def test_get_department(client):

    create_response = await client.post(
        "/api/v1/institution/departments",
        json={
            "code": unique_code(),
            "name": "Information Technology",
        },
    )

    department_id = create_response.json()["id"]

    response = await client.get(
        f"/api/v1/institution/departments/{department_id}"
    )

    assert response.status_code == 200
    assert response.json()["id"] == department_id


@pytest.mark.asyncio
async def test_department_not_found(client):

    unknown_id = str(uuid.uuid4())

    response = await client.get(
        f"/api/v1/institution/departments/{unknown_id}"
    )

    assert response.status_code == 404


@pytest.mark.asyncio
async def test_update_department(client):

    create_response = await client.post(
        "/api/v1/institution/departments",
        json={
            "code": unique_code(),
            "name": "Mechanical Engineering",
        },
    )

    department_id = create_response.json()["id"]

    response = await client.patch(
        f"/api/v1/institution/departments/{department_id}",
        json={
            "name": "Mechanical Engineering Department",
        },
    )

    assert response.status_code == 200

    assert (
        response.json()["name"]
        == "Mechanical Engineering Department"
    )


@pytest.mark.asyncio
async def test_deactivate_department(client):

    create_response = await client.post(
        "/api/v1/institution/departments",
        json={
            "code": unique_code(),
            "name": "Electronics Engineering",
        },
    )

    department_id = create_response.json()["id"]

    response = await client.patch(
        f"/api/v1/institution/departments/{department_id}/status",
        json={
            "is_active": False,
        },
    )

    assert response.status_code == 200
    assert response.json()["is_active"] is False


@pytest.mark.asyncio
async def test_filter_active_departments(client):

    response = await client.get(
        "/api/v1/institution/departments",
        params={
            "is_active": True,
            "limit": 20,
            "offset": 0,
        },
    )

    assert response.status_code == 200

    for department in response.json():
        assert department["is_active"] is True