$ErrorActionPreference = "Stop"

function Test-Api {
    param (
        [string]$Url,
        [string]$Method = "GET",
        [hashtable]$Headers = @{},
        [string]$Body = $null
    )
    try {
        $params = @{
            Uri = $Url
            Method = $Method
            Headers = $Headers
            ContentType = "application/json"
        }
        if ($Body) { $params.Body = $Body }
        
        $response = Invoke-RestMethod @params
        return $response
    } catch {
        Write-Output "Error calling $Url : $_"
        if ($_.Exception.Response) {
            $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
            $responseBody = $reader.ReadToEnd()
            Write-Output "Response Body: $responseBody"
        }
        return $null
    }
}

Write-Output "1. Logging in as ega_admin..."
$loginBody = '{"username":"ega_admin","password":"admin2025"}'
$loginResponse = Test-Api -Url "http://localhost:8080/api/auth/login" -Method "POST" -Body $loginBody

if ($loginResponse -and $loginResponse.token) {
    $token = $loginResponse.token
    Write-Output "Login successful. Token received."
    
    $headers = @{ "Authorization" = "Bearer $token" }
    
    Write-Output "`n2. Fetching Clients..."
    $clients = Test-Api -Url "http://localhost:8080/api/clients" -Headers $headers
    if ($clients) {
        Write-Output "Clients found: $($clients.Count)"
        $clients | ConvertTo-Json -Depth 2
    } else {
        Write-Output "No clients returned or error occurred."
    }

    Write-Output "`n3. Fetching Accounts..."
    $accounts = Test-Api -Url "http://localhost:8080/api/accounts" -Headers $headers
    if ($accounts) {
        Write-Output "Accounts found: $($accounts.Count)"
        $accounts | ConvertTo-Json -Depth 2
    } else {
        Write-Output "No accounts returned or error occurred."
    }

} else {
    Write-Output "Login failed."
}
