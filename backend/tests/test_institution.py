import pytest

@pytest.mark.asyncio
async def test_health_check(client):
    response = await client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["system"] == "CoreSight SIS API"

@pytest.mark.asyncio
async def test_list_departments_empty(client):
    response = await client.get("/api/v1/institution/departments")
    assert response.status_code == 200
    assert response.json() == []