const transactionView = (transaction) => `
<div>
<table class="content-table">
    <thead>
      <tr>
        <th>Amount (£)</th>
        <th>Type</th>
        <th>Description</th>
        <th>Date</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
    <% transactions.forEach(transaction => { %>
        <tr>
            <td><%= transaction.amount %></td>
            <td><%= transaction.type %></td>
            <td><%= transaction.description %></td>
            <td><%= transaction.createdAt.toLocaleDateString() %></td>
            <td>
                <a class="editbtn" href="/transactions/edit/<%= transaction.id %>">Edit</a>
                <form method="POST" action="/transactions/<%= transaction.id %>?_method=DELETE">
                    <button class="deletebtn" type="submit">Delete</button>
                </form>
            </td>
        </tr>
        <% }) %>
    </tbody>
</table>
</div>
`;


const handleSubmit = async () => {
    const searchVal = document.querySelector("#searchInput").value;
    try {
        const transDomRef = document.querySelector('#transItems');
        const ref = await fetch(`/api/search-transaction/?search=${searchVal}`);
        const searchResults = await ref.json();
        let transHtml = [];
        searchResults.forEach(transaction => {
           transHtml.push(transView(transaction));
        });
        transDomRef.innerHTML = transHtml.join(""); 
    } catch (e) {
        console.log(e);
        console.log('could not search api');
    }
  
}